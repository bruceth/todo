import React from "react";
import { VAssignDraft, VAssignEnd, vStopFlag, VAssign } from "../VAssign";
import { CAssignsWithMember, TasksToCategory } from "./withMember/CAssignsWithMember";
import { FA } from "tonva";
import { VAssignTasks } from "./withMember/VAssignTasks";
import { FooterInputProps, VFooterInput } from "../VFooterInput";
import { EnumTaskState } from "tapp";

export class VAssignDraftWithMember extends VAssignDraft<CAssignsWithMember> {
	protected renderDraft() {
		let { isMyAssign } = this.controller;
		if (!isMyAssign) {
			return null; //不是自己创建的任务
		}
		return <>
			<div className="px-3 py-2 border-top bg-white cursor-pointer"
				onClick={this.controller.showAssignTo}>
				<FA className="mr-3 text-info" name="user-plus" fixWidth={true} /> 分配给
			</div>
			{this.renderSelfDone()}
		</>
	}
}

abstract class VAssignWithMemberTasks extends VAssign<CAssignsWithMember> {
	protected renderContent() {
		return <>
			{super.renderContent()}
			{this.renderVm(VAssignTasks)}
		</>;
	}

	protected renderTodos() {
		let {my} = this.controller.tasksToCategory;
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

export class VAssignDoingWithMember extends VAssignWithMemberTasks {
	protected renderContent() {
		return <>
			{super.renderContent()}
			{this.renderFlow()}
		</>;
	}

	protected renderFlow() {
		let cn = 'border border-warning rounded px-2 py-1 d-flex align-items-center';
		let {checker, rater} = this.assign;
		let angle = <FA name="angle-right" className="mx-3 text-muted" />;
		let renderAdmin = (admin:any, action:string): JSX.Element => {
			if (admin) {
				return <>
					{angle}
					<div className={cn}>
						<small className="mr-2">{this.renderUser(admin)}</small>
						<small className="text-muted">{action}</small>
					</div>
				</>;
			}
		}		
		return <div className="d-flex mt-3 px-3 py-2 border-top bg-white align-items-center">
			<FA name="circle-o text-primary small" />
			{angle}
			<div className={cn + ' small'}>执行</div>
			{renderAdmin(checker, '查验')}
			{renderAdmin(rater, '评分')}
			{angle}
			{vStopFlag}
		</div>;
	}

	footer() {
		let {my, myCanEdit} = this.controller.tasksToCategory;
		if (!my || myCanEdit === false) return;
		switch (my.state) {
			default: return;
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing: break;
		}
		let props:FooterInputProps = {
			onAdd: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoItem(inputContent);
				this.scrollToTop();
			},
			caption: '添加我的任务事项'
		};
		return this.renderVm(VFooterInput, props);
	}
}

export class VAssignEndWithMember extends VAssignWithMemberTasks {
}
