import React from "react";
import { CAssigns } from "../CAssigns";
import { tv, BoxId } from "tonva";
import { Group } from "models";
import { observable } from "mobx";

export abstract class CAssignsForGroup extends CAssigns {
	groupBoxId:BoxId;
	@observable group: Group;

	init(group:BoxId) {
		super.init(group);
		this.groupBoxId = group;
	}
	get caption():any {return tv(this.groupBoxId, (values)=><>{values.name}</>)}
	get groupId(): number {return this.groupBoxId.id;}
}
