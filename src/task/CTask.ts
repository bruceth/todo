import _ from 'lodash';
import { observable } from 'mobx';
import { CUqBase, EnumTaskState } from "../tapp";
import { VMyTasks } from "./VMyTasks";
import { QueryPager } from "tonva";
import { VTask } from "./VTask";
import { Task, Assign, AssignTask } from "../models";
import { Performance } from '../tapp'
import { VTaskDone } from './VTaskDone';
import { VTaskCheck } from './VTaskCheck';

export class CTask extends CUqBase {
	private performance: Performance;

	publishAssignCallback:(assign:Assign)=>Promise<void>;
	myTasksPager: QueryPager<AssignTask>;
	@observable task: Task;
	@observable assign: Assign;

	protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
	}

	async showMyTasks() {
		this.myTasksPager = new QueryPager(this.performance.GetMyTasks, 10, 30, true);
		await this.myTasksPager.first({});
		this.openVPage(VMyTasks);
	}
/*
	async showNewAssign(publishTaskCallback:(assign:Assign)=>Promise<void>):Promise<boolean> {
		this.publishAssignCallback = publishTaskCallback;
		return this.vCall(VAssignNew);
	}
*/
	async publishAssign() {
		await this.publishAssignCallback(this.assign);
	}

	async showTask(taskId:number) {
		let retTask = await this.performance.GetTask.query({taskId});
		let task:Task = {} as any;
		_.mergeWith(task, retTask.task[0]);
		task.todos = retTask.todos;
		task.history = retTask.history;
		task.meTask = retTask.meTask;
		this.task = task;
		this.openVPage(VTask);
	}

	async todoTask() {		
	}

	async showTaskDone() {
		this.openVPage(VTaskDone);
	}

	async doneTask() {
		await this.performance.TaskDone.submit({taskId: this.task.id});
	}

	async showTaskCheck() {
		this.openVPage(VTaskCheck);
	}

	newAssign = async (caption:string) => {
		let ret = await this.performance.Assign.save(undefined, {caption});
		this.assign = {
			id: ret.id,
			caption,
			discription: undefined,
			owner: this.user.id,
			open: 0,
			$create: new Date(),
			$update: new Date(),
			items: [],
			//todos: [],
			//history: undefined,
			//meTask: undefined,
		};
	}

	saveAssignItem = async (todoContent: string):Promise<any> => {
		let assignItem = {
			id: undefined as any,
			assign: this.assign.id,
			state: 0,
			discription: todoContent,
		};
		let ret = await this.performance.AssignItem.save(undefined, assignItem);
		assignItem.id = ret.id;
		return assignItem;
	}

	saveAssignProp = async (prop:string, value:any) => {
		await this.performance.Assign.saveProp(this.assign.id, prop, value);
	}
}
