import _ from 'lodash';
import { CUqBase } from "tapp";
import { Performance } from '../tapp'
import { Task, Assign } from "models";
import { QueryPager, BoxId } from "tonva";
import { VList } from "./VList";
import { observable } from "mobx";
import { VAssign } from './VAssign';

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
	//protected abstract createTasksPager():QueryPager<Task>;
	//protected abstract get tasksPagerParam():any;

	init(param?:any) {
		this.performance = this.uqs.performance;
		//this.tasksPager = this.createTasksPager();
	}

	showList = async () => {
		let params = {group: this.groupId};
		let result = await this.performance.GetAssigns.query(params, true);
		//await this.tasksPager.first(this.tasksPagerParam);
		this.assignItems = result.ret;
		this.openVPage(VList);
	}

	showAssign = async (assignId: BoxId) => {
		let retAssign = await this.performance.GetAssign.query({assignId}, true);
		let assign:Assign = {} as any;
		_.mergeWith(assign, retAssign.assign[0])
		this.assign = assign;
		this.openVPage(VAssign);
	}

	showTask = async (taskId:number) => {
		let retTask = await this.performance.GetTask.query({taskId});
		let task:Task = {} as any;
		_.mergeWith(task, retTask.task[0]);
		task.todos = retTask.todos;
		task.flows = retTask.flow;
		task.meTask = retTask.meTask;
		//this.assign = task;
		this.startAction();
		this.openVPage(VAssign);
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
}
