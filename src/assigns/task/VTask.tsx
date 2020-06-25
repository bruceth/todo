import React from "react";
import { CAssigns } from "../CAssigns";
import { VAssign } from "../VAssign";
import { AssignTask } from "models";

export abstract class VTask extends VAssign<CAssigns> {
	protected task: AssignTask;

	init(task: AssignTask) {
		super.init();
		this.task = task;
	}

	protected get back():'close' {return 'close'}

	protected afterAct() {
		this.closePage(2);
		this.controller.showAssign();
	}

	protected renderContent() {
		return <div className="m-3">
			<div className="border rounded">
				{this.renderCaption()}
				{this.renderDiscription()}
				{this.renderTodos()}
			</div>
			{this.renderMore()}
		</div>
	}

	protected abstract renderMore():JSX.Element;
}
