import React from "react";
import { FA } from 'tonva';
import { CAssigns } from "../CAssigns";
import { VAssign } from "../VAssign";
import { AssignTask } from "models";

export abstract class VTask extends VAssign<CAssigns> {
	protected task: AssignTask;

	init(task: AssignTask) {
		super.init();
		this.task = task;
	}

	protected get back():'close' {return 'close'}

	protected afterAct() {
		this.closePage(2);
		this.controller.showAssign();
	}

	protected renderTodos() {
		let {items, todos, tasks} = this.controller.assign;
		let icon = 'circle';
		let cnIcon = 'text-primary';
		let taskId: number = this.task?.id;
		let todoList = todos.filter((t, i) =>{
			if (t.task === taskId && t.assignItem === undefined) return t;
		});
		return <div className="">
			{items.map((v, index) => {
				let {discription, id} = v;
				return <div key={id} className="px-3 py-2 d-flex align-items-center bg-white border-top">
					<small><small><FA name={icon} className={cnIcon} fixWidth={true} /></small></small>
					<div className="flex-fill ml-3">{discription}</div>
				</div>
			})}
			{todoList.map((item, index) => {
				let {discription, id} = item;
				return <div key={-id} className="px-3 py-2 d-flex align-items-center bg-white border-top">
					<small><small><FA name={icon} className={'text'} fixWidth={true} /></small></small>
					<div className="flex-fill ml-3">{discription}</div>
				</div>
			})}
		</div>;
	}


	protected renderContent() {
		return <div className="m-3">
			<div className="border rounded">
				{this.renderCaption()}
				{this.renderDiscription()}
				{this.renderTodos()}
			</div>
			{this.renderMore()}
		</div>
	}

	protected abstract renderMore():JSX.Element;
}
