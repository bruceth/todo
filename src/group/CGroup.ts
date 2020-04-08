import { CUqBase } from "tonvaApp";
import { VMain } from "./VMain";
import { QueryPager, useUser } from "tonva";
import { VGroup } from "./VGroup";
import { VNewTask } from "./VNewTask";
import { observable } from "mobx";
import { CAct } from "act/CAct";
import { VEditTask } from "./VEditTask";
import { stateDefs } from "tools";
import { Note, buildNote, NoteTask, Todo, Task } from "./note";
import { VGroupDetail } from "./VGroupDetail";

export class CGroup extends CUqBase {
	@observable commandsShown: boolean = false;
	@observable currentGroup: any;
	@observable currentTask: Task;

	groupsPager: QueryPager<any>;
	groupNotesPager: QueryPager<Note>;
	//groupItem: any;

    protected async internalStart() {
	}
	
	tab = () => this.renderView(VMain);
	
	async load() {
		this.groupsPager = new QueryPager(this.uqs.performance.GetMyGroups, 10, 30, true);
		await this.groupsPager.first(undefined);
		let i0 = this.groupsPager.items[0];
		if (i0) {
			let n = 20;
			for (let i=0; i<n; i++) {
				//this.groupsPager.items.push(i0);
			}
		}
	}
	/*
	private async assureGroup():Promise<any> {
		let ret = await this.uqs.performance.Group.assureBox(this.groupItem.group.id);
		return ret;
	}
	*/

	async saveGroup(parent:number, name:string, discription:string) {
		let data = {parent, name, discription};
		let ret = await this.uqs.performance.SaveGroup.submit(data);
		let retGroupId = ret?.group;
		let groupBoxId = this.uqs.performance.Group.boxId(retGroupId);
		this.groupsPager.items.unshift({group: groupBoxId, time: new Date()});
	}

	async saveGroupProp(props: {id:number, name:string, discription:string}) {
		await this.uqs.performance.SaveGroupProp.submit(props);
		this.uqs.performance.Group.resetCache(props.id);
	}

	async setGroup(groupId?:number) {
		if (!groupId) groupId = this.currentGroup?.id;
		if (!groupId) return;
		let {Group} = this.uqs.performance;
		Group.resetCache(groupId);
		this.currentGroup = await Group.assureBox(groupId);
	}

	showGroup = async (item: any) => {
		let {performance} = this.uqs;
		await this.setGroup(item.group.id);
		this.groupNotesPager = new QueryPager(performance.GetGroupNotes, 10, 30, true);
		this.groupNotesPager.setEachPageItem(buildNote);
		this.groupNotesPager.setReverse();
		await this.groupNotesPager.first({group: item.group});
		item.unread = 0;
		this.openVPage(VGroup);
	}

	private afterAddNote() {
		this.groupNotesPager.scrollToBottom();
		this.commandsShown = false;
	}

	addNote = async (content: string) => {
		let ret = await this.uqs.performance.SaveNote.submit({group: this.currentGroup, content});
		let retNoteId = ret?.note;
		this.groupNotesPager.items.push({
			id: retNoteId, 
			group: this.currentGroup,
			content, 
			owner:this.user.id, 
			$create: new Date(),
			x: 0,
		});
		this.afterAddNote();
	}

	showNewTask = () => {
		this.openVPage(VNewTask);
	}

	showEditTask = async (noteItem:any, task:any) => {
		let {rettodo, acts, assess} = await this.uqs.performance.GetTodo.query({taskId: task});
		let todo = rettodo[0];
		this.openVPage(VEditTask, {noteItem, task: task, todo, acts, assess:assess[0]});
	}

	showAct = async (noteItem:any, task:any) => {
		let cAct = this.newC(CAct);
		await cAct.start({noteItem, task: task});
		await cAct.showDialog();
	}

	newTask = (caption:string) => {
		this.currentTask = {
			id: undefined,
			caption,
			discription: undefined,
			time: new Date(),
			owner: this.user.id,
			todos: []
		};
	}

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

	saveTodo = async (data: {todoContent: string}) => {
		let {todoContent} = data;
		await this.uqs.performance.SaveTodo.submit({group: this.currentGroup, todoContent});
	}

	// state 10: 待办，state 20: 正办
	taskAct = async (note:Note, toState:stateDefs.todo|stateDefs.doing) => {
		let {obj} = note
		let task: NoteTask = obj as NoteTask;
		let ret = await this.uqs.performance.TaskAct.submit({task: task, toState});
		task.todo = {
			id: ret.todo,
			task: task.id,
			worker: ret.worker,
			state: toState
		} as Todo; //.state = toState;
	}

	revokeTask = async (note:Note) => {
		let {obj} = note
		let task: NoteTask = obj as NoteTask;
		await this.uqs.performance.RemoveTask.submit({note, task});
		note.x = 1;
		task.x = 1;
	};

	async showGroupDetail() {
		let groupMembersPager = new QueryPager(this.uqs.performance.GetGroupMembers, 10, 30);
		groupMembersPager.setEachPageItem(item => {
			useUser(item.member);
		});
		groupMembersPager.first({group: this.currentGroup});
		this.openVPage(VGroupDetail, groupMembersPager);
	}

	async groupAddMember(member:any) {
		await this.uqs.performance.AddGroupMember.submit({group: this.currentGroup, member: member});
	}

	async groupRemoveMembers(members:any[]) {
		await this.uqs.performance.RemoveGroupMember.submit({
			group: this.currentGroup, 
			members: members
		});
	}
}
