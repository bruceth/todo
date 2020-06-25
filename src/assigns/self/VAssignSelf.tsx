import React from "react";
import { VAssignDraft, VAssignEnd } from "../VAssign";
import { CAssignsSelf } from "./CAssignsSelf";

export class VAssignDraftSelf extends VAssignDraft<CAssignsSelf> {
	protected get selfDoneCaption():string {return '完成'}
}

export class VAssignEndSelf extends VAssignEnd<CAssignsSelf> {
	protected get selfDoneCaption():string {return '完成'}
}
