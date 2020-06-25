import _ from 'lodash';
import { CUqBase, EnumTaskState, TaskAct } from "tapp";
import { Performance } from '../tapp'
import { Assign, AssignTask } from "models";
import { BoxId, Tuid } from "tonva";
import { observable } from "mobx";
import { VDone, VCheck, VRate } from './task';
import { VFlowDetail } from './task';

export interface AssignListItem {
	assign: BoxId;
}

export abstract class CAssigns extends CUqBase {
	protected performance: Performance;
	@observable assign: Assign;
	@observable assignListItems: AssignListItem[];
	@observable endListItems: AssignListItem[];

	protected async internalStart() {
	}

	abstract get caption(): any;
	abstract get groupId(): number;
	protected abstract openVList(): void;
	protected abstract openVAssign(): void

	init(param?:any) {
		this.performance = this.uqs.performance;
	}

	showList = async () => {
		let params = {group: this.groupId, end: 0};
		let result = await this.performance.GetAssigns.query(params, true);
		this.assignListItems = result.ret;
		this.openVList();
	}

	async loadEndItems() {
		let params = {group: this.groupId, end: 1};
		let result = await this.performance.GetAssigns.query(params, true);
		this.endListItems = result.ret;
	}

	showAssign = async (assignId?: BoxId) => {
		let id:any = assignId;
		if (!assignId) id = this.assign.id;
		await this.loadAssign(id);
		this.openVAssign();
	}

	/*
	async reloadAssign() {
		if (!this.assign) return;
		await this.loadAssign(this.assign.id);
	}
	*/

	private async loadAssign(assignId:BoxId | number) {
		let retAssign = await this.performance.GetAssign.query({assignId}, true);
		let {assign, items, tasks, todos, tolist} = retAssign;
		let assignObj:Assign = {items, tasks, todos, toList:tolist} as any;
		_.mergeWith(assignObj, assign[0]);
		let discription:string = assignObj.discription;
		if (discription) assignObj.discription = discription.replace(/\\n/g, '\n');
		this.assign = assignObj;
	}

	showFlowDetail = async (task:AssignTask) => {
		let ret = await this.uqs.performance.GetTaskFlow.query({taskId: task.id}, true);
		task.flows = ret.ret;
		this.openVPage(VFlowDetail, task);
	}

	newAssign = async (caption:string) => {
		let data = {group: this.groupId, caption};
		let {CreateAssign} = this.performance;
		let result = await CreateAssign.submit(data);
		let res = result;
		let {id} = res;
		let assign = this.performance.Assign.boxId(id);
		this.assignListItems.unshift({assign});
	}

	async saveAssignDiscription(discription: string) {
		await this.performance.Assign.saveProp(this.assign.id, 'discription', discription);
		this.assign.discription = discription;
	}

	saveAssignItem = async (todoContent: string):Promise<any> => {
		let assignItem = {
			id: undefined as any,
			assign: this.assign.id,
			discription: todoContent,
		};
		let ret = await this.performance.AssignItem.save(undefined, assignItem);
		assignItem.id = ret.id;
		this.assign.items.push({id:ret.id,discription:todoContent});
		return assignItem;
	}

	saveTodoItem = async (todoContent: string):Promise<any> => {
		let id:number = undefined;
		let assignItem: number = undefined;
		let taskId: number = 0;
		for (let item of this.assign.tasks) {
			if (item.worker === this.user.id) {
				taskId = item.id;
				break;
			}
		}
		if (taskId <= 0)
			return;
		let todo = {
			id: id, 
			task: taskId,
			assignItem,
			discription: todoContent,
			x: 0,
			$update: new Date()
		};
		let ret = await this.uqs.performance.Todo.save(undefined, todo);
		todo.id = ret.id;
		this.assign.todos.push(todo);
		return todo;
	}
	

	showDone = async () => {
		this.openVPage(VDone);
	}

	getTaskAction(state:EnumTaskState):string {
		let {checker, rater} = this.assign;
		switch (state) {
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing:
				return TaskAct.done;
			case EnumTaskState.done:
				if (checker) {
					if (this.isMe(checker) === true) return TaskAct.check;
					return;
				}
				if (rater) {
					if (this.isMe(rater)) return TaskAct.rate;
					return;
				}
				return;
			case EnumTaskState.pass:
				if (rater) {
					if (this.isMe(rater)) return TaskAct.rate;
					return;
				}
				return;
			case EnumTaskState.fail:
			case EnumTaskState.rated:
			case EnumTaskState.cancel:
				return;
		}
	}

	meAct = async () => {
		let task = this.assign.tasks.find(v => this.isMe(v.worker) === true);
		if (!task) {
			alert('task cannot be undefined');
			return;
		}
		let {state} = task;
		let {checker, rater} = this.assign;
		let v;
		switch (state) {
			default:
				alert('unkown state ' + state);
				return;
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing:
				v = VDone;
				break;
			case EnumTaskState.done:
				if (checker > 0) v = VCheck;
				else if (rater > 0) v = VRate;
				break;
			case EnumTaskState.pass:
				if (rater > 0) v = VRate;
				break;
		}
		this.openVPage(v, task);
	}

	private afterAct(retAct: {end:number}) {
		if (retAct.end === 0) return;
		let assignId = this.assign.id;
		let index = this.assignListItems.findIndex(v => Tuid.equ(v.assign, assignId));
		if (index < 0) return;
		this.assignListItems.splice(index, 1);
		if (this.endListItems) {
			let assign = this.assignListItems[index];
			this.endListItems.unshift(assign);
		}
		this.cApp.addGroupAssignCount(this.groupId, -1);
	}

	doneAssign = async (point: number, comment: string) => {
		let ret = await this.performance.DoneAssign.submit({assign: this.assign.id, point, comment});
		this.afterAct(ret);
	}

	doneTask = async (task:number, point:number, comment:string) => {
		let ret = await this.performance.DoneTask.submit({task, point, comment});
		this.afterAct(ret);
	}

	passTask = async (task:number, point:number, comment: string) => {
		let ret = await this.performance.PassTask.submit({task, point, comment});
		this.afterAct(ret);
	}

	failTask = async (task:number, comment:string) => {
		let ret = await this.performance.FailTask.submit({task, comment});
		this.afterAct(ret);
	}

	rateTask = async (task:number, point:number, comment:string) => {
		let ret = await this.performance.RateTask.submit({task, point, comment});
		this.afterAct(ret);
	}
}
