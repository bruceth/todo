import React from 'react';
import { VTask } from './VTask';
import { EasyTime, FA } from 'tonva';
import { stateText, actText } from 'tapp';

export class VFlowDetail extends VTask {
	header() {return '任务过程'}

	protected renderFrom():JSX.Element {return;}

	protected renderMore() {
		return <>
			<div className="d-flex mx-3 mt-3 mb-1 align-items-center">
				{this.renderUser(this.task.worker)}
			</div>
			{this.renderFlows()}
		</>;
	}

	private renderFlows() {
		let {flows, worker} = this.task;
		return flows.map((v, index) => {
			let {date, user, state, act} = v;
			let {me} = stateText(state);
			let action = actText(act);
			return <div key={index} className="px-3 py-2 d-flex align-items-center">
				<span className="mr-3 w-8c text-warning">
					<FA name="angle-double-right" className="mr-1" fixWidth={true} />
					<span className="small text-muted"><EasyTime date={date} always={true} /></span>
				</span>
				<span className="mr-3 text-success">{me}</span>
				{user !== worker && <>
					{this.renderUser(user)}<span className="mr-3"/>
					{action && <span className="mr-3 text-info">{action}</span>}
				</>}
			</div>;
		});
	}
}
