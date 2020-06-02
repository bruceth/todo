import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Elements } from 'tonva';
import { CUqApp } from ".";
import { VMain } from './main';
import { CMe } from "me/CMe";
import { CHome } from "home/CHome";
import { CGroup } from "group/CGroup";
import { CJob } from "job/CJob";
import { CTask } from 'task/CTask';
import { CAssign } from 'assign/CAssign';
import { EnumNoteType } from './uqs';
import { CMember } from 'member/CMember';
import { Assign } from 'models';

const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
	cGroup: CGroup;
	cJob: CJob;
    cHome: CHome;
	cMe: CMe;
	cAssign: CAssign;
	cTask: CTask;
	cMember: CMember;

    protected async internalStart() {
		// eslint-disable-next-line 
		let a = undefined??0;
		let {test1, test2} = this.uqs.performance;
		// eslint-disable-next-line
		let [values1, values2] = await Promise.all([
			test1.loadValues(),
			test2.loadValues()
		]);
 
		this.cGroup = this.newC(CGroup);
		this.cGroup.load();
		this.cJob = this.newC(CJob);
		this.cJob.start();
        this.cHome = this.newC(CHome);
		this.cMe = this.newC(CMe);
		this.cAssign = this.newC(CAssign);
		this.cTask = this.newC(CTask);
		this.cMember = this.newC(CMember);
		this.showMain();

		setInterval(this.callTick, 1000);
	}

	private tick = 0;
	private gapIndex = 0;
	private callTick = async () => {
		try {
			if (!this.user) return;
			++this.tick;
			if (this.tick<gaps[this.gapIndex]) return;
			console.error('tick ', new Date());
			this.tick = 0;
			if (this.gapIndex < gaps.length - 1) ++this.gapIndex;
			let ret = await this.uqs.performance.$Poked.query(undefined, false);
			let v = ret.ret[0];
			if (v === undefined) return;
			if (!v.poke) return;
			this.gapIndex = 1;
			this.cGroup.refresh();
		}
		catch {
		}
	}

    showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName);
	}

	refreshJob() {
		this.cJob.refresh();
	}
	
	protected afterStart():Promise<void> {
		let elements:Elements = {
			aId: aTest,
			bId: bTest,
			cId: cTest,
		};

		let n = 1;
		let hello = 'hello';

		function aTest(element: HTMLElement) {
			element.innerText = hello;
		};

		function bTest(element: HTMLElement) {
			element.innerText = hello + ', world!';
		};

		function cTest(element: HTMLElement) {
			ReactDOM.render(<b className="text-success">{hello}, great</b>, element);
		};

		this.hookElements(elements);

		window.onfocus = () => {
			hello = hello + (++n);
			this.hookElements(elements);
		}
		return;
	}

	//====== App calls =======
	async showTask(taskId:number):Promise<void> {
		await this.cTask.showTask(taskId);
	}

	async showNewTask(assign:Assign) {
		await this.cTask.showNew(assign);
	}

	async showMyTasks():Promise<void> {
		await this.cTask.showMyTasks();
	}

	async showAssign(assignId:number):Promise<void> {
		await this.cAssign.showAssign(assignId);
	}

	async showNewAssign():Promise<boolean> {
		let ret = await this.cAssign.showNewAssign(this.cGroup.publishAssign);
		return ret;
	}

	async showMyAssigns():Promise<void> {
		await this.cAssign.showMyAssigns();
	}

	async showMemberDetail(memberId:number):Promise<void> {
		this.cMember.showDetail(memberId);
	}

	async pushTaskNote(retAfterTaskAction:any) {
		if (!retAfterTaskAction) {
			console.error('task action return undefined')
			return;
		}
		let {task, step, state, group} = retAfterTaskAction;
		let data = {
			group, 
			content: step + '|' + state, 
			type:EnumNoteType.Task, 
			obj:task
		};
		await this.uqs.performance.PushNote.submit(data);
		this.resetTick();
		this.cGroup.refresh();
	}

	resetTick() {
		this.tick = 0;
		this.gapIndex = 1;
	}
}
