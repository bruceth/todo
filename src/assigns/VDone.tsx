import React from "react";
import { CAssigns } from "./CAssigns";
import { VAssign } from "./VAssign";


export class VDone extends VAssign<CAssigns> {
	header() {return '完成'}
	protected get back():'close' {return 'close'}

	content() {
		return <div className="m-3">
			<div className="border rounded">
				{this.renderCaption()}
				{this.renderDiscription(false)}
			</div>
			<div className="mt-3 text-center">
				<button className="btn btn-success" onClick={this.done}>确认完成</button>
			</div>
		</div>
	}

	private done = async () => {
		// 暂时界面上不输入分数
		let point = 0;
		await this.controller.doneAssign(point);
		this.closePage(2);
	}
}

