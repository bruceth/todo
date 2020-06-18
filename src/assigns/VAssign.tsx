import React from 'react';
import { VBase } from "./VBase";

export class VAssign extends VBase {
	init(param?: any) {
		super.init(param);
	}

	header() {return '任务详情';}

	content() {
		let {caption} = this.assign;
		return <div className="p-3">
			{caption}
		</div>;
	}
}
