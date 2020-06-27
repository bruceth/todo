import React from "react";
import { VTask } from "./VTask";
import { Todo } from "models";

export class VRate extends VTask {
	header() {return '评价'}

	protected renderMore() {
		return <div className="mt-3 text-center">
			<button className="btn btn-success" onClick={this.done}>评价</button>
		</div>;
	}

	protected renderTodoRadio(todo: Todo): JSX.Element {
		let {check} = todo;
		let checkStr = check===1?'验收':'拒签';

		return <div className="mb-0 mx-3">{checkStr}</div>;
	}

	private done = async () => {
		// 暂时界面上不输入分数
		let point = 0;
		let comment:string;
		await this.controller.rateTask(this.task.id, point, comment);
		this.afterAct();
	}
}
