import React from "react";
import { CAssigns } from "../CAssigns";
import { tv, BoxId, QueryPager, useUser } from "tonva";
import { Group } from "models";
import { observable } from "mobx";
import { VGroupDetail } from "./VGroupDetail";

export abstract class CAssignsForGroup extends CAssigns {
	groupBoxId:BoxId;
	@observable group: Group;

	init(group:BoxId) {
		super.init(group);
		this.groupBoxId = group;
	}
	get caption():any {return tv(this.groupBoxId, (values)=><>{values.name}</>)}
	get groupId(): number {return this.groupBoxId.id;}

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
