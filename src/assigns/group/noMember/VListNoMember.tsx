import React from "react";
import { VList } from "../../VList";
import { CAssignsNoMember } from "./CAssignsNoMember";
import { FA } from "tonva";

export class VListNoMember extends VList<CAssignsNoMember> {
	right() {
		return <button className="btn btn-sm btn-secondary mr-2"
			onClick={this.controller.showGroupDetail}>
			<FA name="ellipsis-h" />
		</button>;
	}
}
