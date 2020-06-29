import React from "react";
import { FA } from "tonva";
import { VAssignDraft, VAssignEnd, vStopFlag } from "../VAssign";
import { CAssignsSelf } from "./CAssignsSelf";
import { AssignItem } from "models";
import { FooterInputProps, VFooterInput } from "../VFooterInput";

export class VAssignDraftSelf extends VAssignDraft<CAssignsSelf> {
	protected get selfDoneCaption():string {return '完成'}

	protected renderAssignItem(item:AssignItem) {
		let {id, discription} = item;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return <div className="pl-4 bg-white">
			{this.renderTodoWithCheck(id, discription, onCheckChanged, false)}
		</div>;
	}

	footer() {
		let props:FooterInputProps = {
			onAdd: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoItem(inputContent);
				this.scrollToTop();
			},
			caption: '添加我的任务事项'
		};
		return this.renderVm(VFooterInput, props);
	}

	protected renderTodos() {
		let {tasks} = this.controller.assign;
		let my = tasks.find(v => this.isMe(v.worker));
		if (!my) {
			return super.renderTodos();
		}
		let {todos} = my;
		return todos.map((item, index) => {
			let {assignItem, discription} = item;
			let cn:string, icon:string;
			if (assignItem) {
				cn = 'text-primary';
				icon = 'circle';
			}
			else {
				cn = 'text-info';
				icon = 'circle-o'
			}
			return <div key={index+1000} className="px-3 py-2 d-flex align-items-center bg-white border-top">
				<small><small><FA name={icon} className={cn} fixWidth={true} /></small></small>
				<div className="flex-fill ml-3">{discription}</div>
			</div>
		});
	}
}

export class VAssignEndSelf extends VAssignEnd<CAssignsSelf> {
	protected get selfDoneCaption():string {return '完成'}

	renderContent() {
		let {tasks} = this.assign;
		let my = tasks[0];
		return <>
			{super.renderContent()}
			<div className="mt-3 px-3 py-2 bg-white">
				{this.renderTaskItem(my)}
				<span className="mx-3">{vStopFlag}</span>
			</div>
		</>;
	}
}
