import { QueryPager } from "tonva";
import { CAssigns } from "assigns/CAssigns";
import { VSelectToList } from "./VSelectToList";
import { VSelectChecker } from "./VSelectChecker";
import { VSelectRater } from "./VSelectRater";
import { VSendOut } from "./VSendOut";
import { VSendBase } from "./VSendBase";
import { CUqSub } from "tapp/CBase";
import { observable } from "mobx";

interface Step {
	caption: string;
	VPage: new (controller: CSend)=>VSendBase
}
export const steps:Step[] = [
	{caption: '指定执行人', VPage: VSelectToList},
	{caption: '指定检查人', VPage: VSelectChecker},
	{caption: '指定评价人', VPage: VSelectRater},
	{caption: '完成', VPage: VSendOut}
];

export class CSend extends CUqSub<CAssigns> {
	step: number = 0;
	membersPager: QueryPager<{member:number}>;
	@observable members:{[id:number]: boolean} = {};
	@observable checker: number = 0;
	@observable rater: number = 0;

	protected async internalStart() {
		this.startAction();
		this.step = 0;
		this.membersPager = new QueryPager(this.uqs.performance.GetGroupMembers, 100);
		await this.membersPager.first({group: this.owner.groupId});
		this.openVPage(steps[0].VPage);
	}

	prev = () => {
		this.popToTopPage();
		this.openVPage(steps[--this.step].VPage);
	}
	next = () => {
		this.popToTopPage();
		this.openVPage(steps[++this.step].VPage);
	}

	sendout = async () => {
		let toList:{to:number}[] = [];
		for (let i in this.members) {
			if (this.members[i] === true) toList.push({to:Number(i)});
		}
		let data = {
			assignId: this.owner.assign.id,
			checkerId: this.checker,
			raterId: this.rater,
			toList
		};
		await this.uqs.performance.SendAssign.submit(data);
		this.owner.reloadAssign();
		this.popToTopPage();
	}

	cancel = async () => {
		this.popToTopPage();
	}
}
