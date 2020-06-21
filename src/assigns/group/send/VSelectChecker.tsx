import React from "react";
import { VSendBase } from "./VSendBase";

export class VSelectChecker extends VSendBase {
	protected renderMiddlePart() {
		return <div>
			{this.renderToList()}
			{this.renderRadios(
				'checker', 
				this.controller.checker, 
				userId=>this.controller.checker=userId,
				'无需检查')}
		</div>
	}
}
