import React from 'react';
import { VTask } from './VTask';
import { TaskFlow } from 'models';
import { EasyTime } from 'tonva';
import { stateText, actText } from 'tapp';

export class VFlowDetail extends VTask {
	header() {return '执行过程'}

	protected renderDiscription(hasTitle:boolean = true) {
		return this.renderDiscriptionContent();
	}

	protected renderFrom():JSX.Element {return;}

	content() {
		let {flows} = this.task;
		return <>
			{super.content()}
			<div className="d-flex mx-3 mt-3 mb-1 align-items-center">{this.renderUserBase(this.task.worker)}</div>
			{this.renderFlows(flows)}
		</>;
	}

	private renderFlows(flows: TaskFlow[]) {
		return flows.map((v, index) => {
			let {date, user, state, act} = v;
			let {me} = stateText(state);
			let action = actText(act);
			return <div key={index} className="px-3 py-2 d-flex align-items-center">
				<span className="mr-3"><EasyTime date={date} always={true} /></span>
				{!this.isMe(user) && <>{this.renderUserBase(user)}<span className="mr-3"/></>}
				{action && <span className="mr-3">{action}</span>}
				<span className="mr-3">{me}</span>
			</div>;
		});
	}
}
