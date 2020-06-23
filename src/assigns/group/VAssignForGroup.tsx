import React from "react";
import { VAssign } from "../VAssign";
import { CAssignsGroup } from "./CAssignsGroup";
import { FA, UserView, User, Image } from "tonva";
import { EnumTaskState, stateText } from "tapp";
import { AssignTask } from "models";

export class VAssignForGroup extends VAssign<CAssignsGroup> {
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

	protected renderTasks() {
		let {tasks, checker, rater} = this.controller.assign;
		let my: AssignTask;
		let starts: AssignTask[] = [];
		let checks: AssignTask[] = [];
		let rates: AssignTask[] = [];

		let dones: AssignTask[] = [];
		let passes: AssignTask[] = [];
		let fails: AssignTask[] = [];
		let rateds: AssignTask[] = [];
		let cancels: AssignTask[] = [];
		let others: AssignTask[] = [];

		let isChecker = this.isMe(checker);
		let isRater = this.isMe(rater);

		for (let task of tasks) {
			let {
				id, //: number; // Task ID ASC,
				assign, //: number|any; // ID Assign,
				worker, //: number; // ID,
				$create, //: Date; // TIMESTAMP,
				state, //: EnumTaskState;
				date, //: Date;
				stepDate, //: Date;
				stepComment, //: string;
			} = task;
			if (this.isMe(worker) === true) {
				my = task;
			}
			else {
				switch (state) {
					case EnumTaskState.start: starts.push(task);  break;
					case EnumTaskState.done:
						(isChecker === true? checks : dones).push(task);
						break;
					case EnumTaskState.pass:
						(isRater === true? rates : passes).push(task);
						break;
					case EnumTaskState.fail: fails.push(task); break;
					case EnumTaskState.rated: rateds.push(task); break;
					case EnumTaskState.cancel: cancels.push(task); break;
					default:
						others.push(task);
						break;
				}
			}
		}

		return <>
			{this.renderChecks(checks)}
			{this.renderRates(rates)}
			{this.renderMy(my)}

			{this.renderOthers(EnumTaskState.start, starts)}
			{this.renderOthers(EnumTaskState.done, dones)}
			{this.renderOthers(EnumTaskState.pass, passes)}
			{this.renderOthers(EnumTaskState.fail, fails)}
			{this.renderOthers(EnumTaskState.rated, rateds)}
			{this.renderOthers(EnumTaskState.cancel, cancels)}
			{this.renderOthers(undefined, others)}
		</>;
	}
	
	private renderUser = (user:User) => {
		let {name, nick, icon} = user;
		return <div className="d-flex align-items-center">
			<Image src={icon} className="w-1c h-1c mr-2" />
			<div>{nick || name}</div>
		</div>;
	}

	private renderMy(task: AssignTask) {
		if (!task) return;
		let {state, end} = task;
		let action = this.controller.getTaskAction(state);
		if (!action) {
			let {me} = stateText(state);
			return <div className="px-3 py-2 bg-white border-bottom cursor-pointer"
				onClick={() => this.controller.showTask(task.id)}>
				我的任务 <span className="text-warning">{me}</span>
				{this.renderEndFlag(end)}
			</div>;
		}
		return <div className="px-3 py-3 bg-white border-bottom cursor-pointer"
			onClick={this.controller.meAct}>
			<FA name="chevron-circle-right" className="text-danger mr-3" />
			<span className="text-primary ">{action}</span> 我的任务
		</div>;
	}

	private renderActions(actName:string, act:(task:AssignTask)=>void, tasks: AssignTask[]) {
		for (let task of tasks) {
			let {worker} = task;
			return <div className="px-3 py-3 bg-white border-bottom cursor-pointer d-flex align-items-center"
				onClick={()=>act(task)}>
				<FA name="chevron-circle-right" className="text-danger mr-3" />
				<span className="text-primary ">{actName}</span>
				<UserView user={worker} render={this.renderUser} />
			</div>
		}
	}
	
	private renderChecks(tasks: AssignTask[]) {
		let act = (task:AssignTask) => alert('正在实现中...');
		return this.renderActions('检查', act, tasks);
	}

	private renderRates(tasks: AssignTask[]) {
		let act = (task:AssignTask) => alert('正在实现中...');
		return this.renderActions('评价', act, tasks);
	}

	private renderEndFlag(end:number) {
		if (end === 1) return <FA className="mx-3 text-danger small" name="stop" />
	}

	private renderOthers(state:EnumTaskState, tasks: AssignTask[]) {
		if (tasks.length === 0) return;
		let {me} = stateText(state);
		return <>
			<div className="h-1c" />
			<div>
				{tasks.map((v:AssignTask, index) => {
					let {id, end} = v;
					return <div key={id} className="d-flex px-3 py-2 bg-white border-bottom cursor-pointer align-items-center"
						onClick={() => alert('显示任务的执行过程')}>
						<UserView user={v.worker} render={this.renderUser} />
						<span className="ml-3">任务{me}</span>
						{this.renderEndFlag(end)}
						<div className="mr-auto"></div>
						<FA name="angle-right" />
					</div>
				})}
			</div>
		</>;
	}
}

export class VAssignForG0 extends VAssign<CAssignsGroup> {
	protected get selfDoneCaption():string {return '完成';}
}
