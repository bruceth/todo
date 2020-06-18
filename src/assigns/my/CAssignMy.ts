import { CAssigns } from "../CAssigns";
import { QueryPager } from "tonva";
import { Task } from "models";

export class CAssignsMy extends CAssigns {
	get caption():string {return '待办作业';}
	get groupId(): number {return 0;}

	/*
	protected createTasksPager():QueryPager<Task> {
		return new QueryPager(this.performance.GetMyTasks, 10, 100);
	}
	protected get tasksPagerParam():any {return;}
	*/
}
