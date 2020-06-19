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
		await this.controller.doneAssign();
		this.closePage(2);
		alert('设计中...暂时并没有实际修改数据库');
	}
}
