import React from "react";
import { CAssigns } from "../CAssigns";
import { VAssign } from "../VAssign";
import { AssignTask } from "models";

export abstract class VTask extends VAssign<CAssigns> {
	protected task: AssignTask;

	init(task: AssignTask) {
		this.task = task;
	}

	protected get back():'close' {return 'close'}

	protected afterAct() {
		this.controller.reloadAssign();
		this.closePage(1);
	}
}
