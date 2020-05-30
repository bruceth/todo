import * as React from 'react';
import { FA } from "tonva";
import { Todo } from 'models';
import { VTaskBase, VTodo } from './VTaskBase';

export class VTaskDone extends VTaskBase {
	header() {
		return '办理';
	}

	private onDone = async () => {
		await this.controller.doneTask();
		this.popToPage();
	}

	private calcEnabled(todos: Todo[]):boolean {
		if (todos === undefined || todos.length === 0) return true;
		for (let todo of todos) {
			let {done} = todo;
			if (done === undefined) return false;
		}
		return true;
	}

	/*
	content() {
		let render = observer(() => {
			let {todos} = this.task;
			let enabled = this.calcEnabled(todos);
			return <div className="bg-white">
				{this.renderTop()}
				{this.renderTodos(todos)}
				<div className="d-flex align-items-center px-3 py-2">
					<button className="btn btn-success" onClick={this.onDone} disabled={!enabled}>
						<FA className="mr-1" name="check-circle" />已办
					</button>
					<div className="flex-fill"></div>
					<button className="btn btn-outline-warning">
						<FA className="mr-1" name="times-circle" />放弃
					</button>
				</div>
			</div>;
		});
		return React.createElement(render);
	}*/

	protected renderCommands():JSX.Element {
		let enabled = this.calcEnabled(this.task.todos);
		return <div className="d-flex align-items-center px-3 py-2">
			<button className="btn btn-success" onClick={this.onDone} disabled={!enabled}>
				<FA className="mr-1" name="check-circle" />已办
			</button>
			<div className="flex-fill"></div>
			<button className="btn btn-outline-warning">
				<FA className="mr-1" name="times-circle" />放弃
			</button>
		</div>;
	}

	protected renderRadios(todo: Todo, vTodo:VTodo): JSX.Element {
		let {id, done} = todo;
		let radios = [
			{val:1, text:'完成'},
			{val:0, text:'未办'},
		];

		let onChange = async (evt:React.ChangeEvent<HTMLInputElement>) => {
			let done:0|1 = Number(evt.target.value) as 0|1;
			await this.controller.saveTodoDone(todo, done);
		};

		return <div>
			{radios.map((v, index) => {
				let {val, text} = v;
				return <label key={index} className="mb-0 mx-3">
					<input className="mr-1" type="radio" value={val} 
						defaultChecked={done===val} name={'rg' + id} onChange={onChange} />
					{text}
				</label>					
			})}
		</div>;
	}

	protected renderDoneMemo(todo: Todo, vTodo:VTodo): JSX.Element {
		if (vTodo === undefined) return;
		let {doneMemo} = todo;
		return <div className="mt-1">
			<span className={'cursor-pointer small text-' + vTodo.doneColor} onClick={() => this.editMemo(todo, vTodo)}>
				<span className="mr-3">
					<FA className="mr-1" name="pencil-square-o" />
					<span className="text-muted">说明</span>
				</span>
				{doneMemo}
			</span>
		</div>;
	}

	protected getEditMemoText(todo:Todo):string {return todo.doneMemo;}
	protected getEditMemoHeader(vTodo:VTodo):string {return vTodo.doneText + '说明';}
}
