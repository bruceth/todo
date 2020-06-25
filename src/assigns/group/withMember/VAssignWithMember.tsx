import React from "react";
import { VAssignDraft, VAssignEnd, vStopFlag, VAssign } from "../../VAssign";
import { CAssignsWithMember } from "./CAssignsWithMember";
import { FA, UserView, User, Image, View } from "tonva";
import { VAssignTasks } from "./VAssignTasks";

export class VAssignDraftWithMember extends VAssignDraft<CAssignsWithMember> {
	protected renderChecker() {
		let {checker} = this.assign;
		if (!checker) return;
		return this.renderCheckerOrRater(checker, '查验人');
	}

	protected renderRater() {
		let {rater} = this.assign;
		if (!rater) return;
		return this.renderCheckerOrRater(rater, '评价人');
	}	

	private renderCheckerOrRater(user:number, caption:string) {
		let renderUser = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-2 border-top bg-white align-items-center small">
				<div className="mr-3">{caption}：</div>
				<Image className="w-1c h-1c mr-3" src={icon} /> 
				<span className="mr-3">{nick || name}</span>
			</div>;
		}
		return <UserView user={user} render={renderUser} />;
	}

	protected renderAssignTo() {
		return <div className="px-3 py-2 border-top bg-white cursor-pointer"
			onClick={this.controller.showAssignTo}>
			<FA className="mr-3 text-info" name="user-plus" fixWidth={true} /> 分配给
		</div>
	}
}

export class VAssignDoingWithMember extends VAssign<CAssignsWithMember> {
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
			if (!admin) return;
			let renderUser = (user:User):JSX.Element => {
				let {icon, name, nick} = user;
				return <div className={cn}>
					<Image className="w-1c h-1c mr-1" src={icon} /> 
					<span className="mr-2 small">{nick || name}</span>
					<small className="text-muted">{action}</small>
				</div>;
			}
			return <>
				{angle}
				<UserView user={admin} render={renderUser} />
			</>;
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
