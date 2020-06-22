import { CUqBase } from "../tapp";
import { VMain } from "./VMain";
import { QueryPager, useUser, Tuid, BoxId } from "tonva";
import { VGroup } from "./VGroup";
import { observable } from "mobx";
import { stateDefs } from "tools";
import { Task, Assign, Group, GroupItem, Doing } from "../models";
import { VGroupDetail } from "./VGroupDetail";
import { Performance } from '../tapp'
import { NoteItem, NoteAssign, dataToNoteItem, createNoteAssign, createNoteText } from "./NoteItem";
import { CAssignsMy, CAssignsGroup } from "assigns";

export class CHome extends CUqBase {
	private performance: Performance;

	currentGroupItem: GroupItem;
	@observable currentGroup: Group;
	@observable currentTask: Task;
	private lastTick: number = 0;
	@observable todosChanged: boolean = false;

	defaultGroupId: number;
	@observable defaultGroupAssignCount: number;
	myGroupsPager: GroupsPager;
	groupNotesPager: QueryPager<NoteItem>;
	myDoingsPager: QueryPager<Doing>;

    protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.myGroupsPager = new GroupsPager(this.performance.GetMyGroups, 10, 500, true);
		this.groupNotesPager = new QueryPager<NoteItem>(this.performance.GetGroupNotes, 10, 30, true);
		this.groupNotesPager.setItemConverter(this.noteItemConverter);
		this.groupNotesPager.setReverse();
		this.myDoingsPager = new QueryPager<Doing>(this.performance.GetMyTasks, 10, 100);
	}
	
	tab = () => this.renderView(VMain);
	
	async load() {
		let arr = [
			//this.myDoingsPager.first(undefined),
			this.myGroupsPager.first(undefined)
		];
		await Promise.all(arr);

		let myDefaultGroupIndex = this.myGroupsPager.items.findIndex(v => v.isDefault === 1);
		if (myDefaultGroupIndex >= 0) {
			let ret = this.myGroupsPager.items.splice(myDefaultGroupIndex, 1);
			let r0 = ret[0];
			this.defaultGroupId = r0.id;
			this.defaultGroupAssignCount = r0.count;
		}
		//await this.groupsPager.first(undefined);
	}

	addGroupAssignCount(group:number, delta:number) {
		if (group === this.defaultGroupId) {
			this.defaultGroupAssignCount += delta;
		}
		else {
			let groupItem = this.myGroupsPager.items.find(v => Tuid.equ(v.group, group)===true);
			if (groupItem) groupItem.count += delta;
		}
	}

	async saveGroup(parent:number, name:string, discription:string) {
		let data = {parent, name, discription};
		let ret = await this.performance.SaveGroup.submit(data);
		let retGroupId = ret?.group;
		let groupBoxId = this.performance.Group.boxId(retGroupId);
		this.myGroupsPager.items.unshift({
			id: retGroupId, 
			group: groupBoxId, 
			count: 1, 
			time: new Date(),
			unread: 0,
			owner: this.user.id,
			isDefault: 0,
			memberCount: 1,
		});
	}

	async saveGroupProp(props: {id:number, name:string, discription:string}) {
		await this.performance.SaveGroupProp.submit(props);
		this.performance.Group.resetCache(props.id);
	}

	async setCurrentGroupItem(groupItem: GroupItem) {
		this.currentGroupItem = groupItem;
		/*
		if (!groupId) groupId = this.currentGroup?.id;
		if (!groupId) return;
		let groupItem = this.groupsPager.findItem(groupId);
		*/
		let {Group:GroupTuid} = this.performance;
		let g: number | BoxId = groupItem.group;
		if (typeof g === 'object') g = g.id;
		this.currentGroup = await GroupTuid.assureBox<Group>(g);
		this.currentGroup.count = groupItem.count;
	}

	private noteItemConverter = (item:any, queryResults:{[name:string]:any[]}):NoteItem => {
		return dataToNoteItem(this, item, queryResults);
	}
	showGroup = async (item: any) => {
		await this.groupNotesPager.first({group: item.group});
		item.unread = 0;
		this.openVPage(VGroup, undefined, ret => {
			this.currentGroup = undefined;
		});
		this.setCurrentGroupItem(item);
		this.cApp.resetTick();
	}

	showMyAssigns = async () => {
		this.todosChanged = false;
		let cAssignsMy = this.newC(CAssignsMy);
		await cAssignsMy.showList();
	}

	showGroupAssigns = async (item: any) => {
		this.todosChanged = false;
		let cAssignsGroup = this.newC(CAssignsGroup, item.group);
		await cAssignsGroup.showList();
	}

	showMyTodos = async () => {
		this.todosChanged = false;
		await this.cApp.showMyTodos();
	}

	async refresh() {
		let arr:Promise<any>[] = [
			this.performance.MyTickTodo.query({lastTick: this.lastTick}, false),
			this.myGroupsPager.refresh()
		];
		if (this.currentGroup) {
			arr.push(this.groupNotesPager.attach());
		}
		let ret = await Promise.all(arr);
		this.lastTick = Date.now()/1000;

		let tickTodo = ret[0];
		if (tickTodo) {
			let retTickTodo:any[] = tickTodo.ret;
			this.todosChanged =  retTickTodo.length > 0;
		}
		if (this.currentGroup) {
			let groupId = this.currentGroup.id;
			let item = this.myGroupsPager.items.find(v => Tuid.equ(v.group, groupId));
			if (item) {
				item.time = new Date();
				item.unread = 0;
			}
		}
	}

	private afterAddNote() {
		this.groupNotesPager.scrollToBottom();
	}

	addTextNote = async (content: string) => {
		let data = {
			group: this.currentGroup, 
			content, 
		};
		let ret = await this.performance.PushNote.submit(data);
		let retNoteId = ret?.note;
		let nts:NoteItem = createNoteText(this, this.user.id, content);
		nts.id = retNoteId;
		this.groupNotesPager.items.push(nts);
		this.afterAddNote();
	}
	saveTaskProp = async (prop:string, value:any) => {
		await this.performance.Assign.saveProp(this.currentTask.id, prop, value);
	}

	publishAssign = async (assign: Assign):Promise<void> => {
		let ret:{note:number} = await this.performance.PublishAssign.submit({
			assignId: assign.id,
			groupId: this.currentGroup.id
		});
		if (!ret) alert('publish assign error');
		let nts = createNoteAssign(this, this.user.id, ret.note);
		nts.id = ret.note;

		// eslint-disable-next-line
		let {id, caption, discription} = assign;
		nts.assignId = id;
		nts.caption = caption;
		nts.discription = discription;
		this.groupNotesPager.items.push(nts);
		this.afterAddNote();
	}

	showNewTask = async ():Promise<boolean> => {
		let ret = await this.cApp.showNewAssign();
		return ret;
	}
	showAssign = async (noteItem:NoteAssign) => {
		this.cApp.showAssign(noteItem.assignId); 
	}

	saveTodo = async (todoContent: string):Promise<any> => {
		let todo = {
			id: undefined as any,
			task: this.currentTask.id,
			state: 0,
			discription: todoContent,
		};
		let ret = await this.performance.Todo.save(undefined, todo);
		todo.id = ret.id;
		return todo;
	}

	// state 10: 待办，state 20: 正办
	taskAct = async (noteItem:NoteItem, toState:stateDefs.todo|stateDefs.doing) => {
		// eslint-disable-next-line
		let ret = await this.performance.TaskAct.submit({task: undefined, toState});
	}

	revokeTask = async (noteItem:NoteItem) => {
		await this.performance.RemoveTask.submit({noteItem, undefined});
	};

	async showGroupDetail() {
		let groupMembersPager = new QueryPager(this.performance.GetGroupMembers, 10, 30);
		groupMembersPager.setEachPageItem((item:any) => {
			useUser(item.member);
		});
		groupMembersPager.first({group: this.currentGroup});
		this.openVPage(VGroupDetail, groupMembersPager);
	}

	async groupAddMember(member:any) {
		await this.performance.AddGroupMember.submit({group: this.currentGroup, member: member});
		if (this.currentGroupItem) this.currentGroupItem.count ++;
		if (this.currentGroup) this.currentGroup.count ++;
	}

	async groupRemoveMembers(members:any[]) {
		await this.performance.RemoveGroupMember.submit({
			group: this.currentGroup, 
			members: members
		});
		if (this.currentGroupItem) this.currentGroupItem.count --;
		if (this.currentGroup) this.currentGroup.count--;
	}
}

class GroupsPager extends QueryPager<GroupItem> {
	protected getRefreshPageId(item:any) {
		if (item === undefined) return;
		let pageId = item['group'];
		if (typeof pageId === 'object') {
			return pageId.id;
		}
		return pageId;
	}
}
