import React from "react";
import { VTask } from "./VTask";
import { List, FA } from "tonva";
import { Todo } from "models";

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
}
