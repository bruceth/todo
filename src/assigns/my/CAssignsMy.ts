import { CAssigns } from "../CAssigns";
import { VListForMy } from "./VListForMy";
import { VAssignForMy } from "./VAssignForMy";

export class CAssignsMy extends CAssigns {
	get caption():string {return '我的待办';}
	get groupId(): number {return 0;}
	protected openVList():void {this.openVPage(VListForMy);}
	protected openVAssign(): void {this.openVPage(VAssignForMy);}
	/*
	protected createTasksPager():QueryPager<Task> {
		return new QueryPager(this.performance.GetMyTasks, 10, 100);
	}
	protected get tasksPagerParam():any {return;}
	*/
}

