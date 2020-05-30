import React from 'react';
import { CTask } from "./CTask";
import { VPage, useUser, List, Page, FA, Muted, UserView, User, EasyTime, Image } from "tonva";
import { Task, Todo } from 'models';
import { observer } from 'mobx-react';

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

export abstract class VTaskBase extends VPage<CTask> {
	protected task: Task;

	init(param?: any) {
		this.task = this.controller.task;
		useUser(this.task.assign.owner);
	}

	content() {
		let render = observer(() => {
			let {todos} = this.task;
			return <div className="bg-white">
				{this.renderTop()}
				{this.renderTodos(todos)}
				{this.renderCommands()}
			</div>;
		});
		return React.createElement(render);
	}

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
		return <>
			<UserView user={owner} render={renderUser} />
			<div className="px-3">
				<div className="py-2"><b>{caption}</b></div>
				{discription && <div className="">{discription}</div>}
			</div>
		</>;
	}

	protected renderTodos(todos: Todo[]):JSX.Element {
		if (todos.length === 0) return;
		return <div className="my-3 border-top border-bottom">
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
		let {doneMemo} = todo;
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
		let {done, checkMemo} = todo;
		if (done !== 1) return;
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
}
