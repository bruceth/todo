import React from "react";
import { VAssign } from "../VAssign";
import { CAssignsMy } from "./CAssignsMy";

export class VAssignForMy extends VAssign<CAssignsMy> {
	protected get selfDoneCaption():string {return '完成'}
}