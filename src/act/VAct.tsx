import * as React from 'react';
import { VPage, Page, tv, FA, List, EasyTime } from "tonva";
import { CAct } from './CAct';
import { stateName, stateDefs } from 'tools';

export class VAct extends VPage<CAct> {
    async open() {
		this.openPage(this.page);
	}

	private renderActFlow() {
		let {acts} = this.controller;
		if (acts.length === 0) return <div className="mt-3"></div>;
		return <List className="mt-3 border-top" items={acts} item={{render: this.renderAct}} />
	}

	private onStart = () => {
		this.todoAct(20);
	}

	private onCancel = () => {
		this.todoAct(50);
	}

	private onDone = () => {
		this.todoAct(30);
	}

	private onAccept = () => {
		this.todoAct(40);
	}

	private onReject = () => {
		this.todoAct(10); // 重新进入待办
	}

	private async todoAct(toState:number) {
		await this.controller.todoAct(toState);
		this.closePage();
	}

	private actButtons():{left:any[], right:any} {
		let ret:{left:any[], right:any} = {left:[], right:[]};
		let {left, right} = ret;
		let btnStart = <button key="start" className="btn btn-success mr-3" onClick={this.onStart}>开始</button>;
		let btnCancel = <button key="cancel" className="btn btn-outline-danger mr-3" onClick={this.onCancel}>取消</button>;
		let btnDone = <button key="done" className="btn btn-success mr-3" onClick={this.onDone}>已办</button>;
		let btnAccept = <button key="accept" className="btn btn-primary mr-3" onClick={this.onAccept}>认可</button>;
		let btnReject = <button key="reject" className="btn btn-warning mr-3" onClick={this.onReject}>需改进</button>;
		let {state} = this.controller.todo;
		switch (state as stateDefs) {
		case stateDefs.todo:
			left.push(btnStart);
			right.push(btnCancel);
			break;
		case stateDefs.doing:
			left.push(btnDone);
			right.push(btnCancel);
			break;
		case stateDefs.done:
			left.push(btnAccept, btnReject);
			break;
		}
		return ret;
	}

	private page = () => {
		let {left, right} = this.actButtons();
		return <Page header="办理事项">
			<div className="m-3 bg-white">
				<div className="px-5 pt-3">
					{this.renderTask()}
					{this.renderActFlow()}
				</div>
				<div className="px-5 py-3 d-flex border-top">
					<div className="flex-fill">{left}</div>
					<div>{right}</div>
				</div>
			</div>
		</Page>;
	}

	private renderAct = (act:any, index:number) => {
		let {toState, date} = act;
		let state = stateName(toState);
		return <div className="p-3">{state} <EasyTime date={date} /></div>;
	}

	private renderTask = ()=> {
		let {task} = this.controller.todo;
		return tv(task, (taskObj) => {
			let {templet} = taskObj;
			return tv(templet, (templetValues:any) => {
				let {discription} = templetValues;
				return <div className="bg-info rounded border border-info">
					<div className="d-flex flex-column">
						<div className="flex-fill d-flex">
							<div className="d-flex align-items-center justify-content-center text-danger w-4c h-4c 
								bg-white border-bottom border-info rounded-top">
								<FA className="text-info" name="podcast" size="lg" />
							</div>
							<div className="p-3 d-flex align-items-center">
								<span className="text-white">{discription}</span>
							</div>
						</div>
					</div>
				</div>
			});
		});
	}
}
