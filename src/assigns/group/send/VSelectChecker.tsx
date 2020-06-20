import React from "react";
import { VSendBase } from "./VSendBase";

export class VSelectChecker extends VSendBase {
	protected renderMiddlePart() {
		return <div>
			{this.renderToList()}
			VSelectChecker
		</div>
	}
}
