import React from "react";
import { VSendBase } from "./VSendBase";

export class VSendOut extends VSendBase {
	renderMiddlePart() {
		return <div>
			{this.renderToList()}
			{this.renderChecker()}
			{this.renderRater()}
		</div>
	}
}
