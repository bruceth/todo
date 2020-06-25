import React from "react";
import { VListNoMember } from "./VListNoMember";
import { VAssignDraftNoMember, VAssignEndNoMember } from "./VAssignNoMember";
import { CAssignsForGroup } from "../CAssignsForGroup";

export class CAssignsNoMember extends CAssignsForGroup {
	protected openVList():void {this.openVPage(VListNoMember);}
	protected openVAssign(): void {
		this.openVPage(this.assign.end === 1? VAssignEndNoMember : VAssignDraftNoMember);
	}
}
