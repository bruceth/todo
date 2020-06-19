import React from "react";
import { CAssigns } from "../CAssigns";
import { QueryPager, BoxId, tv, User, useUser } from "tonva";
import { Task, Group } from "models";
import { VListForGroup } from "./VListForGroup";
import { VList } from "../VList";
import { CAssignsMy } from "assigns/my/CAssignsMy";
import { VGroupDetail } from "./VGroupDetail";
import { observable } from "mobx";
import { VAssignForGroup } from "./VAssignForGroup";

export class CAssignsGroup extends CAssigns {
	groupBoxId:BoxId;
	@observable group: Group;

	init(group:BoxId) {
		super.init(group);
		this.groupBoxId = group;
	}

	get caption():any {return tv(this.groupBoxId, (values)=><>{values.name}</>)}
	get groupId(): number {return this.groupBoxId.id;}
	protected openVList():void {this.openVPage(VListForGroup);}
	protected openVAssign(): void {this.openVPage(VAssignForGroup);}
	/*
	protected createTasksPager():QueryPager<Task> {
		return new QueryPager(this.performance.GetMyTasks, 10, 100);
	}
	protected get tasksPagerParam():any {return;}
	*/

	showGroupDetail = async () => {
		await this.groupBoxId.assure();
		this.group = this.groupBoxId.obj;
		let groupMembersPager = new QueryPager(this.performance.GetGroupMembers, 10, 30);
		groupMembersPager.setEachPageItem((item:any) => {
			useUser(item.member);
		});
		groupMembersPager.first({group: this.group.id});
		this.openVPage(VGroupDetail, groupMembersPager);
	}

	async saveGroupProp(props:any) {
		await this.performance.SaveGroupProp.submit(props);
		this.performance.Group.resetCache(props.id);
	}

	async groupAddMember(member:any) {
		await this.performance.AddGroupMember.submit({group: this.groupId, member: member});
		if (this.group) this.group.count ++;
	}

	async groupRemoveMembers(members:any[]) {
		await this.performance.RemoveGroupMember.submit({
			group: this.groupId, 
			members: members
		});
		if (this.group) this.group.count--;
	}
}
