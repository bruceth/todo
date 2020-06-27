import React from "react";
import { VTask } from "./VTask";
import { List, FA } from "tonva";
import { Todo, AssignItem } from "models";

export class VDone extends VTask {
	header() {return '完成'}

	protected renderMore() {
		return <div className="mt-3 text-center">
			<button className="btn btn-success" onClick={this.done}>确认完成</button>
		</div>
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
		let {id, discription} = todo;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return this.renderTodoWithCheck(id, discription, onCheckChanged);
		/*
		return <div className={'py-2 d-flex'}>
			<div className="mx-3">{this.renderTodoDot(todo)}</div>
			<div className="flex-fill">
				<div className="d-flex">
					<div className="flex-fill">{discription}</div>
					{this.renderTodoRadio(todo)}
				</div>
				{this.renderMemo(todo)}
			</div>
		</div>
		*/
	}

	protected renderAssignItem(item:AssignItem) {
		let {id, discription} = item;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return this.renderTodoWithCheck(id, discription, onCheckChanged);
	}
}
