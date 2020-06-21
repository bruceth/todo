import React from "react";
import { VSendBase } from "./VSendBase";

export class VSelectRater extends VSendBase {
	protected renderMiddlePart() {
		return <div>
			{this.renderToList()}
			{this.renderChecker()}
			{this.renderRadios(
				'rater', 
				this.controller.rater, 
				userId=>this.controller.rater=userId,
				'无需评价')}
		</div>
	}
}
