import React from "react";
import { VSendBase } from "./VSendBase";

export class VSelectRater extends VSendBase {
	protected renderMiddlePart() {
		return <div>
			{this.renderToList()}
			{this.renderChecker()}
			VSelectRater
		</div>
	}
}
