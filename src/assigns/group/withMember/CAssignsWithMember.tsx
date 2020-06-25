import React from "react";
import { QueryPager, useUser } from "tonva";
import { AssignTask } from "models";
import { VListForGroup } from "./VListForGroup";
import { VGroupDetail } from "./VGroupDetail";
import { CSend } from "./send";
import { VCheck, VRate } from "assigns/task";
import { CAssignsForGroup } from "../CAssignsForGroup";
import { VAssignDraftWithMember, VAssignEndWithMember, VAssignDoingWithMember } from "./VAssignWithMember";

export class CAssignsWithMember extends CAssignsForGroup {
	protected openVList():void {this.openVPage(VListForGroup);}
	protected openVAssign(): void {
		let {end, tasks} = this.assign;
		let vp;
		if (end === 1) vp = VAssignEndWithMember;		
		else if (tasks.length === 0) vp = VAssignDraftWithMember;
		else vp = VAssignDoingWithMember;
		this.openVPage(vp);
	}

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

	showAssignTo = async () => {
		let cSend = this.newSub(CSend);
		cSend.start();
	}

	showCheck = async (task: AssignTask) => {
		this.openVPage(VCheck, task);
	}

	showRate = async (task: AssignTask) => {
		this.openVPage(VRate, task);
	}
}
