import React from "react";
import { VAssignDraft, VAssignEnd } from "../../VAssign";
import { CAssignsNoMember } from "./CAssignsNoMember";

export class VAssignDraftNoMember extends VAssignDraft<CAssignsNoMember> {
	protected get selfDoneCaption():string {return '完成'}
}

export class VAssignEndNoMember extends VAssignEnd<CAssignsNoMember> {
	protected get selfDoneCaption():string {return '完成'}
}
