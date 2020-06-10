import { VMemberDetail } from "./VMemberDetail";
import { VMain } from "./VMain";
import { CUqBase } from "tapp";
import { QueryPager } from "tonva";
import { Performance } from '../tapp'
import { VDepartmentList } from "./VDepartmentList";

export interface MemberItem {
	member: number;
	count: number;
}

export class CMember extends CUqBase {
	private performance: Performance;
	myMembersPager: QueryPager<MemberItem>;
	
	protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.myMembersPager = new QueryPager(this.performance.GetMyMembers, 10, 500, true);
	}
	
	showMemberDetail = async (memberId:number) => {
		this.openVPage(VMemberDetail);
	}

	showList = async () => {
		await this.myMembersPager.first(undefined);
		this.openVPage(VMain);
	}

	showDepartment = async () => {
		this.openVPage(VDepartmentList);
	}
}
