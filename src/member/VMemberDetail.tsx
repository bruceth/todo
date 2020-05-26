import React from 'react';
import { VPage } from "tonva";
import { CMember } from "./CMember";

export class VMemberDetail extends VPage<CMember> {
	header() {
		return '详情';
	}
	content() {
		return <div className="p-3">
			群中领办任务详情
		</div>
	}
}
