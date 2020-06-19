import React from "react";
import { VAssign } from "../VAssign";
import { CAssignsGroup } from "./CAssignsGroup";
import { FA } from "tonva";

export class VAssignForGroup extends VAssign<CAssignsGroup> {
	protected renderToList() {
		return <div className="px-3 py-2 border-top bg-white cursor-pointer">
			<FA className="mr-3 text-info" name="user-plus" fixWidth={true} /> 分配给
		</div>
	}

	protected renderChecker() {
		return <div className="px-3 py-2 border-top bg-white cursor-pointer mt-3">
			<FA className="mr-3 text-warning" name="user-o" fixWidth={true} /> 指定检查人
		</div>;
	}

	protected renderRater() {
		return <div className="px-3 py-2 border-top bg-white cursor-pointer">
			<FA className="mr-3 text-success" name="user" fixWidth={true} /> 指定评分人
		</div>;
	}
}
