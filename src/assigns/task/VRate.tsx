import React from "react";
import { VTask } from "./VTask";

export class VRate extends VTask {
	header() {return '评价'}

	protected renderMore() {
		return <div className="mt-3 text-center">
			<button className="btn btn-success" onClick={this.done}>评价</button>
		</div>;
	}

	private done = async () => {
		// 暂时界面上不输入分数
		let point = 0;
		let comment:string;
		await this.controller.rateTask(this.task.id, point, comment);
		this.afterAct();
	}
}
