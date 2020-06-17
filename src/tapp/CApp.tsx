import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.css';
import { Elements, BoxId } from 'tonva';
import { CUqApp } from ".";
import { VMain } from './main';
import { CMe } from "me/CMe";
import { CTest } from "test/CTest";
import { CHome } from "home/CHome";
import { CReport } from "report/CReport";
import { CTask } from 'task/CTask';
import { CAssign } from 'assign/CAssign';
import { EnumNoteType } from './uqs';
import { CMember } from 'member/CMember';
import { Assign } from 'models';
import { CProject, CSelectProject } from 'project';

const gaps = [10, 3,3,3,3,3,5,5,5,5,5,5,5,5,10,10,10,10,15,15,15,30,30,60];

export class CApp extends CUqApp {
	cGroup: CHome;
	cReport: CReport;
    cHome: CTest;
	cMe: CMe;
	cAssign: CAssign;
	cTask: CTask;
	cMember: CMember;
	cProject: CProject;
	cSelectProject: CSelectProject;

    protected async internalStart() {
		// eslint-disable-next-line 
		let a = undefined??0;
		let {test1, test2} = this.uqs.performance;
		// eslint-disable-next-line
		let [values1, values2] = await Promise.all([
			test1.loadValues(),
			test2.loadValues()
		]);
 
		this.cGroup = this.newC(CHome);
		this.cGroup.load();
		this.cReport = this.newC(CReport);
		this.cReport.start();
        this.cHome = this.newC(CTest);
		this.cMe = this.newC(CMe);
		this.cAssign = this.newC(CAssign);
		this.cTask = this.newC(CTask);
		this.cMember = this.newC(CMember);
		this.cProject = this.newC(CProject);
		this.cSelectProject = this.newC(CSelectProject);
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

	showMyTasks = async ():Promise<void> => {
		await this.cReport.showMyTasks();
	}

	showMyTodos = async ():Promise<void> => {
		await this.cReport.showMyTodos();
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
		this.cMember.showMemberDetail(memberId);
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

	showProjects = () => {
		this.cProject.showList();
	}

	async showSelectProject():Promise<BoxId> {
		return await this.cSelectProject.showDialog();
	}
}
