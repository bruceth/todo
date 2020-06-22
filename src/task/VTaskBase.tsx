import React from 'react';
import { CTask } from "./CTask";
import { List, Page, FA, Muted, UserView, User, EasyTime, Image } from "tonva";
import { Todo, TaskFlow } from 'models';
import { observer } from 'mobx-react';
import { EnumTaskState, stateText } from 'tapp';
import { VTodoEdit } from './VTodoEdit';
import { VBase } from './VBase';

export interface TodoOptions {
	radios?: 'done' | 'check';
	pending?: boolean;
}

export enum EnumVTodoType {undone, done, donePass, doneFail};
export abstract class VTodo {
	static create(cTask:CTask, type:EnumVTodoType):VTodo {
		switch (type) {
			default: debugger; throw new Error('unkonw type');
			case EnumVTodoType.undone: return new VTodoUndone(cTask);
			case EnumVTodoType.done: return new VTodoDone(cTask);
			case EnumVTodoType.donePass: return new VTodoDonePass(cTask);
			case EnumVTodoType.doneFail: return new VTodoDoneFail(cTask);
		}
	}

	protected cTask: CTask;
	constructor(cTask: CTask) {
		this.cTask = cTask;
	}
	abstract doneColor: string;
	abstract doneText: string;
	abstract doneIcon: string;
	checkColor: string;
	checkText: string;
	checkIcon: string;
	header: string;

	saveMemo(todo:Todo, memo:string) {
		this.cTask.saveTodoDoneMemo(todo, memo);
	}
}

class VTodoUndone extends VTodo {
	doneColor = 'danger';
	doneText = '未办';
	doneIcon = 'minus';
	header = '未办说明';
}

class VTodoDone extends VTodo {
	doneColor = 'success';
	doneText = '完成';
	doneIcon = 'check';
	header = '完成说明';
}

abstract class VTodoCheck extends VTodoDone {
	checkColor: string;
	checkText: string;
	checkIcon: string;
	saveMemo(todo:Todo, memo:string) {
		this.cTask.saveTodoCheckMemo(todo, memo);
	}
}

class VTodoDonePass extends VTodoCheck {
	checkColor = 'success';
	checkText = '验收';
	checkIcon = 'check';
}

class VTodoDoneFail extends VTodoCheck {
	checkColor = 'danger';
	checkText = '拒签';
	checkIcon = 'times';
}

export abstract class VTaskBase extends VBase {
	content() {
		let render = observer(() => {
			let {todos, flows, state} = this.task;
			return <div className="">
				{this.renderTop()}
				{this.renderTodos(todos)}
				{this.renderFlows(flows)}
				{this.renderState(state)}
				{this.renderCommands()}
			</div>;
		});
		return React.createElement(render);
	}

	protected get commandContainerClass() {return 'border-top border-bottom bg-light '}
	protected renderCommands():JSX.Element {
		return;
	}

	protected renderTop():JSX.Element {
		let {caption, discription, $create, $update, owner} = this.task;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		let renderUser = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-2 bg-light">
				<Image className="w-2c h-2c" src={icon} /> 
				<div className="ml-3">
					<div>{nick || name}</div>
					<div><Muted><EasyTime date={$create} /> {spanUpdate}</Muted></div>
				</div>
			</div>;
		}
		let vDisp;
		if (discription) {
			let parts = discription.split('\\n');
			vDisp = <div className="mt-2">
				{parts.map((p, index) => <div key={index}>{p}</div>)}
			</div>;
		}
		return <>
			<UserView user={owner} render={renderUser} />
			<div className="px-3 py-3 bg-white">
				<div><b>{caption}</b></div>
				{vDisp}
			</div>
		</>;
	}

	protected renderTodos(todos: Todo[]):JSX.Element {
		if (todos.length === 0) return;
		return <div className="border-top border-bottom">
			<div className="border-bottom bg-light small py-1 px-3 text-muted">事项</div>
			<List items={todos} 
				item={{render: this.renderTodo}} />
		</div>;
	}

	protected renderRadios(todo: Todo, vTodo:VTodo): JSX.Element {
		return;
	}

	protected renderDoneMemo(todo: Todo, vTodo:VTodo): JSX.Element {
		if (vTodo === undefined) return;
		let {state} = this.task;
		switch (state) {
			case EnumTaskState.todo:
				return;
		}
		let {done, doneMemo} = todo;
		if (done === undefined) return;
		let {doneColor: color, doneText, doneIcon} = vTodo;
		return <div className="mt-1">
			<span className={'small text-' + color}>
				<span className="mr-3">
					<FA className="mr-1" name={doneIcon} />
					<span className="text-muted">{doneText}</span>
				</span>
				{doneMemo}
			</span>
		</div>;
	}

	protected renderCheckMemo(todo: Todo, vTodo:VTodo): JSX.Element {
		if (vTodo === undefined) return;
		let {state} = this.task;
		switch (state) {
			case EnumTaskState.done:
				return;
		}
		let {check, checkMemo} = todo;
		if (check === undefined) return;
		let {checkColor, checkText, checkIcon} = vTodo;
		return <div className="mt-1">
			<span className={'small text-' + checkColor}>
				<span className="mr-3">
					<FA className="mr-1" name={checkIcon} />
					<span className="text-muted">{checkText}</span>
				</span>
				{checkMemo}
			</span>
		</div>;
	}

	protected createVTodo(todo: Todo):VTodo {
		let {done, check} = todo;
		if (done === 0) return VTodo.create(this.controller, EnumVTodoType.undone);
		if (done === 1) {
			switch (check) {
				default: return VTodo.create(this.controller, EnumVTodoType.done);
				case 1: return VTodo.create(this.controller, EnumVTodoType.donePass);
				case 0: return VTodo.create(this.controller, EnumVTodoType.doneFail);
			}
		}
	}

	private renderTodo = (todo: Todo, index: number): JSX.Element => {
		let {discription, assignItem, x} = todo;
		if (x === 1) return null;
	
		let vTodo = this.createVTodo(todo);
		let dotColor:string, dotIcon:string;
		if (assignItem) {
			dotIcon = 'circle';
			dotColor = 'text-black';
		}
		else {
			dotIcon = 'circle';
			dotColor = 'text-primary';
		}

		let vLeft = <small><small><FA name={dotIcon} className={dotColor} fixWidth={true} /></small></small>;
		return <div className={'py-2 d-flex'}>
			<div className="mx-3">{vLeft}</div>
			<div className="flex-fill">
				<div className="d-flex">
					<div className="flex-fill">{discription}</div>
					{this.renderRadios(todo, vTodo)}
				</div>
				{this.renderDoneMemo(todo, vTodo)}
				{this.renderCheckMemo(todo, vTodo)}
			</div>
		</div>
	}

	private renderFlowUser = (user:User):JSX.Element => {
		let {name, nick} = user;
		return <span>{nick || name}</span>;
	}

	private renderFlows(flows: TaskFlow[]):JSX.Element {
		if (!flows) return;
		return <div className="pt-3">
			{flows.map((v, index) => {
				let {date, user, state, comment} = v;
				let pointer = <FA className="text-success mr-1" name="check-circle-o" />;
				// eslint-disable-next-line
				let {me, act} = stateText(state);
				return <div key={index} className="px-3 py-1 small">
					{pointer} <span className="mr-3 text-success">{act}</span> 
					<span className="mr-3"><EasyTime date={date} always={true} /></span>
					<span className="mr-3"><UserView user={user} render={this.renderFlowUser}/></span>
					<span>{comment}</span>
				</div>
			})}
		</div>;
	}

	private renderState(state: EnumTaskState):JSX.Element {
		let {me} = stateText(state);
		if (!me) return;
		return <div className="px-3 pt-2 pb-3 text-primary">
			<FA className="mr-2" name="chevron-circle-right" />
			<b>{me}</b>
		</div>;
	}

	protected getEditMemoText(todo:Todo):string {return;}
	protected getEditMemoHeader(vTodo:VTodo):string {return;}

	protected editMemo = (todo:Todo, vTodo:VTodo) => {
		let {discription} = todo;
		//let {header} = vTodo;
		let header = this.getEditMemoHeader(vTodo);
		let memo = this.getEditMemoText(todo);
		let inputValue:string;
		let onSave = async () => {
			vTodo.saveMemo(todo, inputValue); // this.controller.saveTodoMemo(todo, inputValue);
			this.closePage();
		}
		let onChange = (evt:React.ChangeEvent<HTMLTextAreaElement>) => {
			inputValue = evt.target.value;
		}
		let onKeyDown = (evt:React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (evt.keyCode === 13) onSave();
		};
		let right = <button className="btn btn-sm btn-success" onClick={onSave}>保存</button>;
		this.openPageElement(<Page back="close" header={header} right={right}>
			<div className="p-3">
				<div className="mb-3">{discription}</div>
				<textarea className="form-control"
					placeholder={header} onChange={onChange}
					onKeyDown={onKeyDown}
					defaultValue={memo} maxLength={200} />
			</div>
		</Page>);
	}

	protected closeAction(msg: JSX.Element|string, afterClose?: ()=>void) {
		let vMsg = (typeof msg === 'string')?
				<div className="p-5 text-center">{msg}</div>
				:
				msg;
		let onClose = () => {
			this.popToTopPage();
			if (afterClose) afterClose();
		}
		this.openPageElement(<Page header={false}>
			<div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
				<div className="border border-info rounded bg-white"
					style={{minWidth:'20rem', maxWidth: '40rem'}}>
					{vMsg}
					<div className="text-center border-top border-info p-3 rounded-bottom bg-light">
						<button className="btn btn-info" onClick={onClose}>
							<FA className="mr-1" name="times-circle" />
							关闭
						</button>
					</div>
				</div>
			</div>
		</Page>);
	}
	
	private onCmdEditTodos = () => {
		this.openVPage(VTodoEdit);
	}
	
	protected renderCmdEditTodos():JSX.Element {
		if (this.task.state === EnumTaskState.todo) {
			return <button className="btn btn-outline-info" onClick={this.onCmdEditTodos}>
				<FA name="pencil-square-o" /> 增减事项
			</button>;
		}
	}

	protected gap():JSX.Element {
		return <div className="ml-3 border-left" />;
	}

	/*
	private onCmdComment = () => {
		// alert('评论正在实现中...');
		this.closeAction(<div className="p-5 text-center">
			OK OK OK 评论正在实现中...
		</div>);
	}
	protected renderCmdComment():JSX.Element {
		return <div className="cursor-pointer" onClick={this.onCmdComment}><FA name="commenting-o" /> 评论</div>
	}
	*/
}
