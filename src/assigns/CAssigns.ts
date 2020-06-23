import _ from 'lodash';
import { CUqBase, EnumTaskState, TaskAct } from "tapp";
import { Performance } from '../tapp'
import { Task, Assign } from "models";
import { BoxId, Tuid } from "tonva";
import { observable } from "mobx";
import { VDone, VCheck, VRate } from './task';

export interface AssignItem {
	assign: BoxId;
}

export abstract class CAssigns extends CUqBase {
	protected performance: Performance;
	@observable assign: Assign;
	@observable assignItems: AssignItem[];
	@observable endItems: AssignItem[];

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
		this.assignItems = result.ret;
		this.openVList();
	}

	async loadEndItems() {
		let params = {group: this.groupId, end: 1};
		let result = await this.performance.GetAssigns.query(params, true);
		this.endItems = result.ret;
	}

	showAssign = async (assignId: BoxId) => {
		await this.loadAssign(assignId);
		this.openVAssign();
	}

	async reloadAssign() {
		if (!this.assign) return;
		await this.loadAssign(this.assign.id);
	}

	private async loadAssign(assignId:BoxId | number) {
		let retAssign = await this.performance.GetAssign.query({assignId}, true);
		let {assign, items, tasks, todos, tolist} = retAssign;
		let assignObj:Assign = {items, tasks, todos, toList:tolist} as any;
		_.mergeWith(assignObj, assign[0]);
		let discription:string = assignObj.discription;
		if (discription) assignObj.discription = discription.replace(/\\n/g, '\n');
		this.assign = assignObj;
	}

	showTask = async (taskId:number) => {
		alert('show task 的代码都要改写为新的');
		return;
		let retTask = await this.performance.GetTask.query({taskId});
		let task:Task = {} as any;
		_.mergeWith(task, retTask.task[0]);
		task.todos = retTask.todos;
		task.flows = retTask.flow;
		task.meTask = retTask.meTask;
		let discription:string = task.discription;
		if (discription) task.discription = discription.replace(/\\n/g, '\n');

		this.startAction();
		this.openVAssign();
	}

	newAssign = async (caption:string) => {
		let data = {group: this.groupId, caption};
		let {CreateAssign} = this.performance;
		let result = await CreateAssign.submit(data);
		let res = result;
		let {id} = res;
		let assign = this.performance.Assign.boxId(id);
		this.assignItems.unshift({assign});
	}

	async saveAssignDiscription(discription: string) {
		await this.performance.Assign.saveProp(this.assign.id, 'discription', discription);
		this.assign.discription = discription;
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
				if (checker > 0) return TaskAct.check;
				if (rater > 0) return TaskAct.rate;
				return;
			case EnumTaskState.pass:
				if (rater > 0) return TaskAct.rate;
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
				break;
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing:
				this.openVPage(VDone, task);
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
		let index = this.assignItems.findIndex(v => Tuid.equ(v.assign, assignId));
		if (index < 0) return;
		this.assignItems.splice(index, 1);
		if (this.endItems) {
			let assign = this.assignItems[index];
			this.endItems.unshift(assign);
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
