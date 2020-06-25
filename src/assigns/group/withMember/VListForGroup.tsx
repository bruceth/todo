import React from "react";
import { VList } from "../../VList";
import { FA } from "tonva";
import { CAssignsWithMember } from "./CAssignsWithMember";

export class VListForGroup extends VList<CAssignsWithMember> {
	right() {
		return <button className="btn btn-sm btn-secondary mr-2"
			onClick={this.controller.showGroupDetail}>
			<FA name="ellipsis-h" />
		</button>;
	}
}
