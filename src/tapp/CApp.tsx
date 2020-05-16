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

export class CApp extends CUqApp {
	cGroup: CGroup;
	cTodo: CJob;
    cHome: CHome;
	cMe: CMe;
	cAssign: CAssign;
	cTask: CTask;

    protected async internalStart() {
		let {test1, test2} = this.uqs.performance;
		// eslint-disable-next-line
		let [values1, values2] = await Promise.all([
			test1.loadValues(),
			test2.loadValues()
		]);
 
		this.cGroup = this.newC(CGroup);
		this.cGroup.load();
		this.cTodo = this.newC(CJob);
		this.cTodo.start();
        this.cHome = this.newC(CHome);
		this.cMe = this.newC(CMe);
		this.cAssign = this.newC(CAssign);
		this.cTask = this.newC(CTask);
		this.showMain();
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
}
