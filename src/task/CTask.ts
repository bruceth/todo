import _ from 'lodash';
import { observable } from 'mobx';
import { CUqBase } from "../tapp";
import { VMyTasks } from "./VMyTasks";
import { QueryPager } from "tonva";
import { VTask } from "./VTask";
import { Task, Assign, AssignTask } from "../models";
import { Performance, EnumTaskStep } from '../tapp'
import { VTaskDone } from './VTaskDone';
import { VTaskCheck } from './VTaskCheck';
import { VTaskRate } from './VTaskRate';
import { VTodoEdit } from './VTodoEdit';

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
		this.myTasksPager = new QueryPager(this.performance.GetMyTaskArchive, 10, 30, true);
	}

	async loadTaskArchive(step: EnumTaskStep) {
		this.myTasksPager.reset();
		await this.myTasksPager.first({step});
	}

	async showMyTasks() {
		await this.myTasksPager.first({});
		this.openVPage(VMyTasks);
	}

	async showTask(taskId:number) {
		let retTask = await this.performance.GetTask.query({taskId});
		let task:Task = {} as any;
		_.mergeWith(task, retTask.task[0]);
		task.todos = retTask.todos;
		task.flow = retTask.flow;
		task.meTask = retTask.meTask;
		this.task = task;
		this.openVPage(VTask);
	}

	async showTaskDone() {
		this.openVPage(VTaskDone);
	}
	
	async doneTask() {
		let ret = await this.performance.TaskDone.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	async showTaskCheck() {
		this.openVPage(VTaskCheck);
	}

	async passTask() {
		let ret = await this.performance.TaskPass.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	async failTask() {
		let ret = await this.performance.TaskFail.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}

	async showTaskRate() {
		this.openVPage(VTaskRate);
	}

	async rateTask() {
		let ret = await this.performance.TaskRate.submit({taskId: this.task.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
	}
	/*
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
	*/

	showTodoEdit = async () => {
		this.openVPage(VTodoEdit, undefined, ret => {
			
		});
	}
}
