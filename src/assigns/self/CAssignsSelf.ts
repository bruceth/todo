import { CAssigns } from "../CAssigns";
import { VListForSelf } from "./VListForSelf";
import { VAssignDraftSelf, VAssignEndSelf } from "./VAssignSelf";

export class CAssignsSelf extends CAssigns {
	get caption():string {return '我的待办';}
	get groupId(): number {return 0;}
	protected openVList():void {this.openVPage(VListForSelf);}
	protected openVAssign(): void {
		this.openVPage(this.assign.end === 1? VAssignEndSelf : VAssignDraftSelf);
	}
}

