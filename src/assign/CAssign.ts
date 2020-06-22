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
		this.myAssignsPager = new QueryPager(this.performance.GetMyAssigns, 10, 30, true);
		this.myAssignsPager.setItemConverter((item, results):Assign => {
			let assign:Assign = item;
			assign.tasks = (results.tasks as any[]).filter(v => v.assign===assign.id);
			return assign;
		});
	}

	async loadAssigns(archived: 0|1) {
		this.myAssignsPager.reset();
		await this.myAssignsPager.first({archived});
	}

	private async showMyAssignsInternal(archived: 0|1) {
		let myAssignsPager = new QueryPager(this.performance.GetMyAssigns, 10, 30, true);
		myAssignsPager.setItemConverter((item, results):Assign => {
			let assign:Assign = item;
			assign.tasks = (results.tasks as any[]).filter(v => v.assign===assign.id);
			return assign;
		});
		myAssignsPager.first({archived});
		this.openVPage(VMyAssigns, {myAssignsPager, archived});
	}

	async showMyAssigns() {
		await this.showMyAssignsInternal(0);
	}

	async showMyAssignsArchived() {
		await this.showMyAssignsInternal(1);
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
		this.openVPage(VAssign, undefined, (ret:any) => {
			//if (!ret) return;
			let item = this.myAssignsPager.findItem(assignId);
			if (!item) return;
			this.myAssignsPager.refreshItems(item);
		});
	}

	async publishAssign() {
		await this.publishAssignCallback(this.assign);
	}

	takeAssign = async () => {
		this.cApp.showNewTask(this.assign);
		/*
		let ret = await this.performance.TakeAssign.submit({assignId: this.assign.id});
		this.cApp.refreshJob();
		this.cApp.pushTaskNote(ret);
		this.closePage();
		*/
	}

	showTask = async (taskId:number) => {
		await this.cApp.showTask(taskId);
	}

	newAssign = async (caption:string, point:number) => {
		let ret = await this.performance.NewAssign.submit({caption, point});
		this.assign = {
			id: ret.id,
			caption,
			discription: undefined,
			owner: this.user.id,
			checker: undefined,
			rater: undefined,
			open: 1,
			point: point,
			groupId: undefined,
			groupMemberCount: undefined,
			$create: new Date(),
			$update: new Date(),
			items: [],
			toList: [],
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

	saveAssignProject = async (project:any) => {
		await this.performance.SaveAssignProject.submit({assignId:this.assign.id, projectId:project});
	}
}
