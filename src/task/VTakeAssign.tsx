import React from 'react';
import { VTaskBase } from "./VTaskBase";
import { FA } from 'tonva';

export class VTakeAssign extends VTaskBase {
	header() {return '领办作业';}

	private renderCmdTake() {
		return <button className="btn btn-primary" onClick={this.onTakeAssign}>
			<FA className="mr-2" name="chevron-circle-right" />
			领办作业
		</button>;
	}

	private onTakeAssign = async () => {
		let ret = await this.controller.takeAssign();
		let msg = ret === false? 
			'你已经领办过这个作业，不能重复领办' :
			'新任务已经加入待办清单';
		this.closeAction(msg, ()=>this.closePage());
	}

	protected renderCommands():JSX.Element {
		let divCmds:any[] = [
			this.renderCmdEditTodos(),
			this.renderCmdTake(),
			//this.renderCmdDone(),
			//this.renderCmdCheck(),
			//this.renderCmdRate(),
		];
		let first = true;
		return <div className="px-3 py-2 d-flex align-items-end">
			{divCmds.map((v, index) => {
				if (!v) return null;
				let gap:any;
				if (first === false) {
					gap = this.gap();
				}
				else {
					first = false;
				}
				return <React.Fragment key={index}>
					{gap}{v}
				</React.Fragment>;
			})}
			<div className="flex-fill"></div>
			{this.renderCmdComment()}
		</div>;
	};
}
