import * as React from 'react';
import { FA } from "tonva";
import { EnumTaskState } from '../tapp';
import { VTodoEdit } from './VTodoEdit';
import { VTaskBase } from './VTaskBase';

export class VTask extends VTaskBase {
	header() {
		return '任务';
	}

	/*
	content() {
		let {caption, discription, $create, $update, owner, todos, state} = this.task;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		let {pending} = stateText(state);
		switch (state) {
			case EnumTaskState.start:
			case EnumTaskState.todo:
			case EnumTaskState.doing:
				pending = true; break;
			case EnumTaskState.done:
			case EnumTaskState.pass:
			case EnumTaskState.rated:
			case EnumTaskState.archive:
			case EnumTaskState.cancel:
				pending = false; break;
		}
		let renderTop = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-2 bg-light">
				<Image className="w-2c h-2c my-1" src={icon} /> 
				<div className="ml-3">
					<div>{nick || name}</div>
					<div><Muted><EasyTime date={$create} /> {spanUpdate}</Muted></div>
				</div>
			</div>;
		}
		return <div className="bg-white">
			{this.renderTop()}
			{this.renderTodos(todos)}
			{this.renderCommands()}
		</div>;
	}
	*/
	
	private renderCmdButton(text:string, onClick:()=>void) {
		return <button className="btn btn-primary" onClick={onClick}>
			<FA className="mr-1" name="chevron-circle-right" />{text}
		</button>;
}

	private onCmdDo = () => {
		this.controller.showTaskDone();
	}
	private renderCmdDone():JSX.Element {
		if (this.task.state === EnumTaskState.todo) {
			return this.renderCmdButton('处理', this.onCmdDo);
			/*
			return <button className="btn btn-primary" onClick={this.onCmdDo}>
				<FA className="text-danger ml-2" name="chevron-right-o" />办理
			</button>;
			*/
		}
	}

	private onCmdCheck = () => {
		this.controller.showTaskCheck();
	}
	private renderCmdCheck():JSX.Element {
		if (this.task.state === EnumTaskState.done) {
			return this.renderCmdButton('查验', this.onCmdCheck);
			/*
			return <button className="btn btn-primary" onClick={this.onCmdCheck}>
				<FA className="text-danger ml-2" name="chevron-right-o" />查验
			</button>;
			*/
		}
	}

	private onCmdRate = () => {
		this.controller.showTaskRate();
	}
	private renderCmdRate():JSX.Element {
		if (this.task.state === EnumTaskState.pass) {
			return this.renderCmdButton('评价', this.onCmdRate);
			/*
			return <button className="btn btn-primary" onClick={this.onCmdRate}>
				<FA className="text-danger ml-2" name="chevron-right-o" />评价
			</button>;
			*/
		}
	}


	private onCmdEditTodos = () => {
		// this.controller.showTodoEdit();
		this.openVPage(VTodoEdit);
		/*, undefined, async () => {
			this.refreshTodos();
			return;
		});*/

	}
	private renderCmdEditTodos():JSX.Element {
		if (this.task.state === EnumTaskState.todo) {
			return <div className="cursor-pointer" onClick={this.onCmdEditTodos}>
				<FA name="pencil-square-o" /> 增减事项			
			</div>;
		}
	}

	private onCmdComment = () => {
		alert('评论正在实现中...');
	}
	private renderCmdComment():JSX.Element {
		return <div className="cursor-pointer" onClick={this.onCmdComment}><FA name="commenting-o" /> 评论</div>
	}

	private gap():JSX.Element {
		return <div className="ml-3 border-left" />;
	}

	protected renderCommands():JSX.Element {
		let divCmds:any[] = [
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
			<div className="flex-fill"></div>
			{this.renderCmdEditTodos()}
			{this.gap()}
			{this.renderCmdComment()}
		</div>;
	};
}
