import _ from 'lodash';
import { CUqBase } from "tapp";
import { Performance } from '../tapp'
import { Task, Assign } from "models";
import { QueryPager, BoxId } from "tonva";
import { observable } from "mobx";
import { VDone } from './VDone';

export interface AssignItem {
	assign: BoxId;
}

export abstract class CAssigns extends CUqBase {
	protected performance: Performance;
	@observable assign: Assign;
	tasksPager: QueryPager<Task>;
	@observable assignItems: AssignItem[];

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
		let params = {group: this.groupId};
		let result = await this.performance.GetAssigns.query(params, true);
		this.assignItems = result.ret;
		this.openVList();
	}

	showAssign = async (assignId: BoxId) => {
		let retAssign = await this.performance.GetAssign.query({assignId}, true);
		let {assign, items, tasks, todos, tolist} = retAssign;
		let assignObj:Assign = {items, tasks, todos, toList:tolist} as any;
		_.mergeWith(assignObj, assign[0]);
		let discription:string = assignObj.discription;
		if (discription) assignObj.discription = discription.replace(/\\n/g, '\n');
		this.assign = assignObj;
		this.openVAssign();
	}

	showTask = async (taskId:number) => {
		let retTask = await this.performance.GetTask.query({taskId});
		let task:Task = {} as any;
		_.mergeWith(task, retTask.task[0]);
		task.todos = retTask.todos;
		task.flows = retTask.flow;
		task.meTask = retTask.meTask;
		let discription:string = task.discription;
		if (discription) task.discription = discription.replace(/\\n/g, '\n');

		//this.assign = task;
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

	doneAssign = async () => {		
	}
}
