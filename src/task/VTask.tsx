import * as React from 'react';
import { EnumTaskState } from '../tapp';
import { VTaskBase } from './VTaskBase';
import { FA } from 'tonva';

export class VTask extends VTaskBase {
	header() {return '任务';}
	
	protected renderCmdButton(text:string, onClick:()=>void) {
		return <button className="btn btn-outline-primary" onClick={onClick}>
			<FA className="mr-2" name="chevron-circle-right" />{text}
		</button>;
	}
	
	private onCmdDo = () => {
		this.controller.showDone();
	}
	private renderCmdDone():JSX.Element {
		if (this.task.state === EnumTaskState.todo) {
			return this.renderCmdButton('开始办理', this.onCmdDo);
		}
	}

	private onCmdCheck = () => {
		this.controller.showTaskCheck();
	}
	private renderCmdCheck():JSX.Element {
		if (this.task.state === EnumTaskState.done) {
			return this.renderCmdButton('开始查验', this.onCmdCheck);
		}
	}

	private onCmdRate = () => {
		this.controller.showTaskRate();
	}
	private renderCmdRate():JSX.Element {
		if (this.task.state === EnumTaskState.pass) {
			return this.renderCmdButton('开始评价', this.onCmdRate);
		}
	}

	protected renderCommands():JSX.Element {
		let divCmds:any[] = [
			this.renderCmdEditTodos(),
			this.renderCmdDone(),
			this.renderCmdCheck(),
			this.renderCmdRate(),
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
			<div className="flex-grow-1"></div>
			{this.renderCmdComment()}
		</div>;
	};
}
