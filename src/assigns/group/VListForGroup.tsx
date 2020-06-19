import React from "react";
import { VList } from "../VList";
import { FA } from "tonva";
import { CAssignsGroup } from "./CAssignsGroup";

export class VListForGroup extends VList<CAssignsGroup> {
	right() {
		return <button className="btn btn-sm btn-secondary mr-2"
			onClick={this.controller.showGroupDetail}>
			<FA name="ellipsis-h" />
		</button>;
	}
}
