import React from "react";
import { VAssignDraft, VAssignDoing, VAssignEnd, vStopFlag, VAssign } from "../../VAssign";
import { CAssignsWithMember } from "./CAssignsWithMember";
import { FA } from "tonva";
import { VAssignTasks } from "./VAssignTasks";

export class VAssignDraftWithMember extends VAssignDraft<CAssignsWithMember> {
	protected renderDraft() {
		let { assign } = this.controller;
		if (!this.isMe(assign.owner)) {
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

export class VAssignDoingWithMember extends VAssignDoing<CAssignsWithMember> {
	protected renderDraft():JSX.Element {
		return null;
	}
	protected renderContent() {
		return <>
			{super.renderContent()}
			{this.renderVm(VAssignTasks)}
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
}

export class VAssignEndWithMember extends VAssignEnd<CAssignsWithMember> {
	protected renderContent() {
		return <>
			{super.renderContent()}
			{this.renderVm(VAssignTasks)}
		</>;
	}
}
