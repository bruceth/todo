import { observable } from 'mobx';
import _ from 'lodash';
import { CUqBase } from "../tapp";
import { VMyAssigns } from "./VMyAssigns";
import { QueryPager } from "tonva";
import { Assign } from "../models";
import { Performance } from '../tapp'
import { VAssignNew } from './VAssignNew';
import { VAssign } from './VAssign';

export class CAssign extends CUqBase {
	private performance: Performance;

	publishAssignCallback:(assign:Assign)=>Promise<void>;
	myAssignsPager: QueryPager<Assign>;
	@observable assign: Assign;

	protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
	}

	async showMyAssigns() {
		this.myAssignsPager = new QueryPager(this.performance.GetMyAssigns, 10, 30, true);
		this.myAssignsPager.setItemConverter((item, results):Assign => {
			let assign:Assign = item;
			assign.tasks = (results.tasks as any[]).filter(v => v.assign===assign.id);
			return assign;
		});
		await this.myAssignsPager.first({});
		this.openVPage(VMyAssigns);
	}

	async showNewAssign(publishTaskCallback:(assign:Assign)=>Promise<void>):Promise<boolean> {
		this.publishAssignCallback = publishTaskCallback;
		return this.vCall(VAssignNew);
	}

	private async loadAssign(assignId:number) {
		let retAssign = await this.performance.GetAssign.query({assignId});
		let {assign, items, tasks} = retAssign;		
		let assignObj:Assign = {} as any;
		_.mergeWith(assignObj, assign[0]);
		assignObj.items = items;
		assignObj.tasks = tasks;
		this.assign = assignObj;
	}

	async showAssign(assignId:number) {
		await this.loadAssign(assignId);
		this.openVPage(VAssign);
	}

	async publishAssign() {
		await this.publishAssignCallback(this.assign);
	}

	taskAssign = async () => {
		// eslint-disable-next-line
		let ret = await this.performance.TaskAssign.submit({assignId: this.assign.id});
		this.closePage();
	}

	showTask = async (taskId:number) => {
		await this.cApp.showTask(taskId);
	}

	newAssign = async (caption:string) => {
		let ret = await this.performance.Assign.save(undefined, {caption});
		this.assign = {
			id: ret.id,
			caption,
			discription: undefined,
			owner: this.user.id,
			open: 1,
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
