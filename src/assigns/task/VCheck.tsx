import React from "react";
import { VTask } from "./VTask";
import { FA } from "tonva";
import { Todo } from "models";
import { MemoInputProps, VMemoInput } from "assigns/VMemoInput";

export class VCheck extends VTask {
	header() {return '查验'}

	private calcEnabled(todos: Todo[]):boolean {
		if (todos === undefined || todos.length === 0) return true;
		for (let todo of todos) {
			let {check} = todo;
			if (check === undefined) return false;
		}
		return true;
	}

	protected renderMore() {
		let enabled = this.calcEnabled(this.task.todos);
		return <div className="mt-3 d-flex">
			<button className="btn btn-success mx-auto px-4" onClick={this.pass} disabled={!enabled}>
				<FA className="mr-2" name="check" /> 验收
			</button>
			<button className="btn btn-outline-danger" onClick={this.fail}>
				<FA name="times" /> 拒签
			</button>
		</div>;
	}

	private pass = async () => {
		// 暂时界面上不输入分数
		let point = 0;
		let comment:string;
		await this.controller.passTask(this.task.id, point, comment);
		this.afterAct();
	}

	private fail = async () => {
		let comment:string;
		await this.controller.failTask(this.task.id, comment);
		this.afterAct();
	}

	protected renderTodos():JSX.Element {
		// 改写，根据Check来显示。每项需要加确认
		return super.renderTodos();
	}

	protected renderTodo (todo:Todo, index:number):JSX.Element {
		let {discription} = todo;
		return <div className={'py-2 d-flex'}>
			<div className="mx-3">{this.renderTodoDot(todo)}</div>
			<div className="flex-fill">
				<div className="d-flex">
					<div className="flex-fill">{discription}</div>
					{this.renderTodoRadio(todo)}
				</div>
				{this.renderMemo(todo)}
				{this.renderCheckMemo(todo)}
			</div>
		</div>
	}

	protected renderTodoRadio(todo: Todo): JSX.Element {
		let {id, check} = todo;
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

	protected renderCheckMemo(todo: Todo):JSX.Element {
		let props:MemoInputProps = {
			onUpdate: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoCheckMemo(todo, inputContent);
			},
			content: todo.checkMemo,
			placeholder: '添加验收说明'
		};
		return this.renderVm(VMemoInput, props);
	}

}
