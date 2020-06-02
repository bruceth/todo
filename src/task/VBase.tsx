import { CTask } from "./CTask";
import { VPage, useUser } from "tonva";
import { Task } from "models";

export abstract class VBase extends VPage<CTask> {
	protected task: Task;

	init(param?: any) {
		this.task = this.controller.task;
		if (this.task) {
			useUser(this.task.assign.owner);
		}
	}

}
