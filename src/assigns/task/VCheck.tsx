import React from "react";
import { VTask } from "./VTask";
import { FA } from "tonva";

export class VCheck extends VTask {
	header() {return '查验'}
	protected get back():'close' {return 'close'}

	content() {
		return <div className="m-3">
			<div className="border rounded">
				{this.renderCaption()}
				{this.renderDiscription(false)}
			</div>
			<div className="mt-3 d-flex">
				<button className="btn btn-success mx-auto px-4" onClick={this.pass}>
					<FA className="mr-2" name="check" /> 验收
				</button>
				<button className="btn btn-outline-danger" onClick={this.fail}>
					<FA name="times" /> 拒签
				</button>
			</div>
		</div>
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
}

