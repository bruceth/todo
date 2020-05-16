import { CUqBase, EnumNoteType } from "../tapp";
import { VMain } from "./VMain";
import { QueryPager, useUser } from "tonva";
import { VGroup } from "./VGroup";
import { observable } from "mobx";
import { stateDefs } from "tools";
import { Task, Assign } from "../models";
import { VGroupDetail } from "./VGroupDetail";
import { Performance } from '../tapp'
import { NoteItem, NoteAssign, dataToNoteItem, createNoteAssign, createNoteText } from "./NoteItem";

export class CGroup extends CUqBase {
	private performance: Performance;

	@observable commandsShown: boolean = false;
	@observable currentGroup: any;
	@observable currentTask: Task;

	groupsPager: QueryPager<any>;
	groupNotesPager: QueryPager<NoteItem>;

    protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
	}
	
	tab = () => this.renderView(VMain);
	
	async load() {
		this.groupsPager = new QueryPager(this.performance.GetMyGroups, 10, 30, true);
		await this.groupsPager.first(undefined);
		let i0 = this.groupsPager.items[0];
		if (i0) {
			let n = 20;
			for (let i=0; i<n; i++) {
				//this.groupsPager.items.push(i0);
			}
		}
	}

	async saveGroup(parent:number, name:string, discription:string) {
		let data = {parent, name, discription};
		let ret = await this.performance.SaveGroup.submit(data);
		let retGroupId = ret?.group;
		let groupBoxId = this.performance.Group.boxId(retGroupId);
		this.groupsPager.items.unshift({group: groupBoxId, time: new Date()});
	}

	async saveGroupProp(props: {id:number, name:string, discription:string}) {
		await this.performance.SaveGroupProp.submit(props);
		this.performance.Group.resetCache(props.id);
	}

	async setGroup(groupId?:number) {
		if (!groupId) groupId = this.currentGroup?.id;
		if (!groupId) return;
		let {Group} = this.performance;
		//Group.resetCache(groupId);
		this.currentGroup = await Group.assureBox(groupId);
	}

	private noteItemConverter = (item:any, queryResults:{[name:string]:any[]}):NoteItem => {
		return dataToNoteItem(this, item, queryResults);
	}
	showGroup = async (item: any) => {
		this.groupNotesPager = new QueryPager<NoteItem>(this.performance.GetGroupNotes, 10, 30, true);
		this.groupNotesPager.setItemConverter(this.noteItemConverter);
		this.groupNotesPager.setReverse();
		await this.groupNotesPager.first({group: item.group});
		item.unread = 0;
		this.openVPage(VGroup);
		this.setGroup(item.group.id);
	}

	private afterAddNote() {
		this.groupNotesPager.scrollToBottom();
		this.commandsShown = false;
	}

	addNote = async (content: string, type:EnumNoteType, obj: number) => {
		let ret = await this.performance.PushNote.submit({group: this.currentGroup, content, type, obj});
		let retNoteId = ret?.note;
		let nts:NoteItem;
		switch (type) {
		default:
		case EnumNoteType.Text:
			nts = createNoteText(this, this.user.id, content);
			break;
		case EnumNoteType.Assign:
			nts = createNoteAssign(this, this.user.id, obj);
			break;
		}
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
		nts.id = id;
		//nts.caption = caption;
		//nts.discription = discription;
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
/*
	private processTask = async (task:Task): Promise<void> => {
		let ret = await this.performance.TodoTask.submit({groupId: this.currentGroup.id, taskId: task.id});
	}
*/

/*
	showAct = async (noteItem:any, task:any) => {
		let cAct = this.newC(CAct);
		await cAct.start({noteItem, task: task});
		await cAct.showDialog();
	}
*/
/*
	newTask = async (caption:string) => {
		let ret = await this.performance.Task.save(undefined, {caption});
		this.currentTask = {
			id: ret.id,
			caption,
			discription: undefined,
			group: 1,
			owner: this.user.id,
			$create: new Date(),
			$update: new Date(),
			state: 0,
			todos: [],
			history: undefined,
			meTask: undefined,
		};
	}
*/
	/*
	task = async (discription:string):Promise<void> => {
		let {performance} = this.uqs;
		let tt = await performance.TodoTemplet.save(undefined, {
			discription,
			due: -1,	// 预估时间分钟
			rate: 0,		// 评级, 0=一般，1=难
			owner: this.user.id,
			project: 0,
		});
		let ret:{note:number, task:number} = await performance.TaskTodo.submit({
			group: this.currentGroup, 
			todoTemplet: tt.id
		});
		let {note:noteId, task: task} = ret;

		let noteTask = new NoteTask();
		noteTask.id = task;
		noteTask.discription = discription;
		noteTask.todo = undefined;
		noteTask.templet = tt.id;
		
		let note = {
			id: noteId,
			group: this.currentGroup,
			content: undefined as string, 
			type: 1,
			obj: noteTask,
			owner:this.user.id, 
			$create: new Date(),
			x: 0,
		};
		this.groupNotesPager.items.push(note);
		this.afterAddNote();
	}
	*/

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
		//let {obj} = note
		//let task: NoteTask = obj as NoteTask;
		
		// eslint-disable-next-line
		let ret = await this.performance.TaskAct.submit({task: undefined, toState});
		/*
		task.todo = {
			id: ret.todo,
			task: task.id,
			//worker: ret.worker,
			state: toState
		} as Todo; //.state = toState;
		*/
	}

	revokeTask = async (noteItem:NoteItem) => {
		//let {obj} = note
		//let task: NoteTask = obj as NoteTask;
		await this.performance.RemoveTask.submit({noteItem, undefined});
		//note.x = 1;
		//task.x = 1;
	};

	async showGroupDetail() {
		let groupMembersPager = new QueryPager(this.performance.GetGroupMembers, 10, 30);
		groupMembersPager.setEachPageItem(item => {
			useUser(item.member);
		});
		groupMembersPager.first({group: this.currentGroup});
		this.openVPage(VGroupDetail, groupMembersPager);
	}

	async groupAddMember(member:any) {
		await this.performance.AddGroupMember.submit({group: this.currentGroup, member: member});
	}

	async groupRemoveMembers(members:any[]) {
		await this.performance.RemoveGroupMember.submit({
			group: this.currentGroup, 
			members: members
		});
	}
}
