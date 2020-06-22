import React from "react";
import { VAssign } from "../VAssign";
import { CAssignsGroup } from "./CAssignsGroup";
import { FA, UserView, User, Image } from "tonva";
import { EnumTaskState, stateText } from "tapp";
import { AssignTask } from "models";
import { findAllByTestId } from "@testing-library/react";

export class VAssignForGroup extends VAssign<CAssignsGroup> {
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
			{this.renderMy(my)}
			{this.renderChecks(checks)}
			{this.renderRates(rates)}

			<div className="h-1c" />
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
		let {state} = task;
		let {me, act} = stateText(state);
		return <div className="px-3 py-3 bg-white border-bottom cursor-pointer"
			onClick={()=>alert('正在实现中...')}>
			<FA name="chevron-circle-right" className="text-danger mr-3" />
			<span className="text-primary ">{me}</span> 我的任务
		</div>
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

	private renderOthers(state:EnumTaskState, tasks: AssignTask[]) {
		if (tasks.length === 0) return;
		let {me, other} = stateText(state);
		return <div>
			{tasks.map((v, index) => {
				return <div className="d-flex px-3 py-2 bg-white border-bottom cursor-pointer"
					onClick={() => alert('显示任务的执行过程')}>
					<UserView user={v.worker} render={this.renderUser} />
					<span className="ml-3">{other || me}任务</span>
					<div className="mr-auto"></div>
					<FA name="angle-right" />
				</div>
			})}
		</div>;
	}
}

export class VAssignForG0 extends VAssign<CAssignsGroup> {
	protected get selfDoneCaption():string {return '完成';}
}
