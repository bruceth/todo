import React from "react";
import { VTask } from "./VTask";
import { FA } from "tonva";
import { Todo } from "models";
import { InfoInputProps, VInfoInput } from "assigns/VInfoInput";

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
		let {id, discription, doneMemo, checkMemo} = todo;

		return <div className={'d-flex'}>
		<label key={id} className="flex-grow-1 px-3 py-2 m-0 d-flex bg-white cursor-point">
			<div className="mx-3">{this.renderTodoDot(todo)}</div>
			<div className="flex-grow-1">
				<div className="">{discription}</div>
				{doneMemo && <div className="mt-1 small">
					<FA name="comment-o" className="mr-2 text-primary" />
					<span className="text-info">{doneMemo}</span>
				</div>}
				{checkMemo && <div className="mt-1 small">
					<FA name="comments-o" className="mr-2 text-primary" />
					<span className="text-info">{checkMemo}</span>
				</div>}
			</div>
			{this.renderTodoRadio(todo)}
		</label>
		{this.renderCheckMemo(todo)}
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
		let props:InfoInputProps = {
			onUpdate: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoCheckMemo(todo, inputContent);
			},
			content: todo.checkMemo,
			color: 'text-info'
		};
		return this.renderVm(VInfoInput, props);
	}

}
