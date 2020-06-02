import * as React from 'react';
import { FA } from "tonva";
import { VTaskBase, VTodo } from './VTaskBase';
import { Todo } from 'models';

export class VCheck extends VTaskBase {
	header() {return '查验';}

	private onPass = async () => {
		this.openVPage(VCheckSubmit, 'pass');
	}

	private onFail = async () => {
		this.openVPage(VCheckSubmit, 'fail');
	}

	private commandsVisible(todos: Todo[]):boolean {
		if (todos === undefined || todos.length === 0) return true;
		for (let todo of todos) {
			let {done, check} = todo;
			if (done === 1 && check === undefined) return false;
		}
		return true;
	}

	protected renderCommands():JSX.Element {
		if (this.commandsVisible(this.task.todos) === true) {
			return <div className="d-flex align-items-center px-3 py-2">
				<button className="btn btn-success" onClick={this.onPass}>
					<FA className="mr-1" name="check-circle" /> 验收任务
				</button>
				<div className="flex-fill"></div>
				<button className="btn btn-outline-danger" onClick={this.onFail}>
					<FA className="mr-1" name="times-circle" /> 拒签任务
				</button>
			</div>;
		}
		else {
			return <div className="px-3 py-2 text-info">
				<FA className="mr-3" name="hand-o-right" /> 请先验收各个事项，然后验收任务
			</div>;
		}
	}
	
	protected renderRadios(todo: Todo, vTodo:VTodo): JSX.Element {
		let {id, done, check} = todo;
		if (done !== 1) return;
		let radios = [
			{val:1, text:'验收'},
			{val:0, text:'拒签'},
		];

		let onChange = async (evt:React.ChangeEvent<HTMLInputElement>) => {
			let check:0|1 = Number(evt.target.value) as 0|1;
			await this.controller.saveTodoCheck(todo, check);
		};

		return <div>
			{radios.map((v, index) => {
				let {val, text} = v;
				return <label key={index} className="mb-0 mx-3">
					<input className="mr-1" type="radio" value={val} 
						defaultChecked={check===val} name={'rg' + id} onChange={onChange} />
					{text}
				</label>					
			})}
		</div>;
	}

	protected onEditMemo(todo: Todo, vTodo:VTodo) {
		return () => this.editMemo(todo, vTodo);
	}
	protected memoLabel(vTodo:VTodo) {
		return <>
			<FA className="mr-1" name="pencil-square-o" />
			<span className="text-muted">{vTodo.checkText}说明</span>
		</>
	}

	protected renderCheckMemo(todo: Todo, vTodo:VTodo): JSX.Element {
		if (vTodo === undefined) return;
		let {done, check, checkMemo} = todo;
		if (done !== 1) return;
		if (check === undefined) return;
		let {checkColor} = vTodo;
		let onClick = this.onEditMemo(todo, vTodo);
		let cursor = onClick && 'cursor-pointer';
		return <div className="mt-1">
			<span className={'small text-' + checkColor + ' ' + cursor} onClick={onClick}>
				<span className="mr-3">
					{this.memoLabel(vTodo)}
				</span>
				{checkMemo}
			</span>
		</div>;
	}

	protected getEditMemoText(todo:Todo):string {return todo.checkMemo;}
	protected getEditMemoHeader(vTodo:VTodo):string {return vTodo.checkText + '说明';}
}

const btnSuccess = {
	text: '验收',
	color: 'success',
	icon: 'check'
}
const btnFail = {
	text: '拒签',
	color: 'danger',
	icon: 'times'
}
class VCheckSubmit extends VCheck {
	private checkResult: 'pass' | 'fail';
	init(checkResult: 'pass' | 'fail') {
		super.init();
		this.checkResult = checkResult;
	}
	header() {return '提交查验';}

	protected renderRadios(todo: Todo, vTodo:VTodo): JSX.Element {
		return;
	}

	protected onEditMemo(todo: Todo, vTodo:VTodo):()=>void {return;}
	protected memoLabel(vTodo:VTodo) {
		let {checkIcon, checkText} = vTodo;
		return <>
			<FA className="mr-1" name={checkIcon} />
			<span className="text-muted">{checkText}</span>
		</>
	}

	protected renderCommands():JSX.Element {
		let {color, text, icon} = (this.checkResult === 'pass')? btnSuccess:btnFail;
		return <div className="py-3">
			<div className="px-3">
				<textarea className={'w-100 form-control border-' + color} placeholder={text + '说明'} />
			</div>
			<div className="pt-3 text-center">
				<button className={'btn w-25 btn-' + color} onClick={this.onSubmit}>
					<FA className="mr-2" name={icon} /> 提交{text}
				</button>
			</div>
		</div>;
	}

	private onSubmit = async () => {
		switch (this.checkResult) {
			case 'pass': await this.controller.passTask(); break;
			case 'fail': await this.controller.failTask(); break;
		}
		this.closeAction('查验完成');
	}
}
