import React from "react";
import { CAssigns } from "../CAssigns";
import { VAssign } from "../VAssign";
import { Task } from "models";

export abstract class VTask extends VAssign<CAssigns> {
	protected task: Task;

	init(task: Task) {
		this.task = task;
	}

	protected get back():'close' {return 'close'}
}
