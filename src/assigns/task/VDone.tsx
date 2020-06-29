import React from "react";
import { VTask } from "./VTask";
import { List, FA } from "tonva";
import { Todo, AssignItem } from "models";
import { MemoInputProps, VMemoInput } from "assigns/VMemoInput";

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

	protected renderTodo (todo:Todo, index:number):JSX.Element {
		let {id, discription, done} = todo;
		let onCheckChanged = async (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			await this.controller.saveTodoDone(todo, isChecked?1:0);
			return;
		}
		let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
			if (!onCheckChanged) return;
			onCheckChanged(evt.target.checked);
		}
		//return this.renderTodoWithCheck(id, discription, onCheckChanged, done === 1);
		return <div className={'py-2 d-flex'}>
			<label key={id} className="px-3 py-2 m-0 d-flex align-items-center bg-white cursor-point">
				<input type="checkbox" onChange={onChange} defaultChecked={done === 1}/>
			</label>
			<div className="flex-fill">
				<div className="d-flex">
					<div className="flex-fill">{discription}</div>
				</div>
				<div className="p-2">
				{this.renderMemo(todo)}
				</div>
			</div>
		</div>
	}

	protected renderMemo(todo: Todo):JSX.Element {
		let props:MemoInputProps = {
			onUpdate: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoDoneMemo(todo, inputContent);
			},
			content: todo.doneMemo,
			placeholder: '添加说明'
		};
		return this.renderVm(VMemoInput, props);
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
