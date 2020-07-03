import React from "react";
import { VTask } from "./VTask";
import { Todo, AssignItem } from "models";
import { InfoInputProps, VInfoInput } from "assigns/VInfoInput";
import { FA } from "tonva";
import { observable } from "mobx";

export class VDone extends VTask {
	header() {return '完成'}

	protected renderMore() {
		let enabled = this.calcEnabled(this.task.todos);
		return <div className="mt-3 text-center">
			<button className="btn btn-success" onClick={this.done} disabled={!enabled}>确认完成</button>
		</div>
	}

	private calcEnabled(todos: Todo[]):boolean {
		if (todos === undefined || todos.length === 0) return true;
		for (let todo of todos) {
			let {done} = todo;
			if (done === undefined || done === 0) return false;
		}
		return true;
	}


	private done = async () => {
		// 暂时界面上不输入分数
		let point = 0;
		let comment:string;
		if (this.task) {
			await this.controller.doneTask(this.task.id, point, comment);
		}
		else {
			await this.controller.doneAssign(point, comment);
		}
		this.afterAct();
	}

	@observable private disabled: boolean;
	protected renderTodo (todo:Todo, index:number):JSX.Element {
		let {id, discription, done, doneMemo} = todo;
		let onCheckChanged = async (isChecked:boolean):Promise<void> => {
			await this.controller.saveTodoDone(todo, isChecked?1:0);
			return;
		}
		let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
			if (!onCheckChanged) return;
			onCheckChanged(evt.target.checked);
		}

		return <div className={'d-flex'}>
			<label key={id} className="flex-grow-1 px-3 py-2 m-0 d-flex bg-white cursor-point">
				<input className="mt-1 mr-3" type="checkbox" onChange={onChange} defaultChecked={done === 1}/>
				<div className="flex-grow-1">
					<div className="">{discription}</div>
					{doneMemo && <div className="mt-1 small">
						<FA name="comment-o" className="mr-2 text-primary" />
						<span className="text-info">{doneMemo}</span>
					</div>}
				</div>
			</label>
			{this.renderMemo(todo)}
		</div>
	}

	protected renderMemo(todo: Todo):JSX.Element {
		let props:InfoInputProps = {
			onUpdate: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoDoneMemo(todo, inputContent);
			},
			content: todo.doneMemo,
			color: 'text-info'
		};
		return this.renderVm(VInfoInput, props);
	}

	protected renderAssignItem(item:AssignItem) {
		let {id, discription} = item;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return this.renderTodoWithCheck(id, discription, onCheckChanged, false);
	}
}
