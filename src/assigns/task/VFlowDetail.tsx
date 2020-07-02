import React from 'react';
import { VTask } from './VTask';
import { EasyTime } from 'tonva';
import { stateText, actText } from 'tapp';

export class VFlowDetail extends VTask {
	header() {return '执行过程'}

	protected renderFrom():JSX.Element {return;}

	protected renderMore() {
		return <>
			<div className="d-flex mx-3 mt-3 mb-1 align-items-center">{this.renderUser(this.task.worker)}</div>
			{this.renderFlows()}
		</>;
	}

	private renderFlows() {
		let {flows} = this.task;
		return flows.map((v, index) => {
			let {date, user, state, act} = v;
			let {me} = stateText(state);
			let action = actText(act);
			return <div key={index} className="px-3 py-2 d-flex align-items-center">
				<span className="mr-3"><EasyTime date={date} always={true} /></span>
				{!this.isMe(user) && <>{this.renderUser(user)}<span className="mr-3"/></>}
				{action && <span className="mr-3">{action}</span>}
				<span className="mr-3">{me}</span>
			</div>;
		});
	}
}
