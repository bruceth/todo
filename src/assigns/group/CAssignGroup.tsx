import React from "react";
import { CAssigns } from "../CAssigns";
import { QueryPager, BoxId, tv } from "tonva";
import { Task, Group } from "models";

export class CAssignsGroup extends CAssigns {
	private group:BoxId;

	init(group:BoxId) {
		super.init(group);
		this.group = group;
	}

	get caption():any {return tv(this.group, (values)=><>{values.name}</>)}
	get groupId(): number {return this.group.id;}
	/*
	protected createTasksPager():QueryPager<Task> {
		return new QueryPager(this.performance.GetMyTasks, 10, 100);
	}
	protected get tasksPagerParam():any {return;}
	*/
}
