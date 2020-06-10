import React from 'react';
import { VPage } from "tonva";
import { CMember } from "./CMember";

export class VMemberDetail extends VPage<CMember> {
	header() {
		return '详情';
	}
	content() {
		return <div className="p-3">
			同事详情 正在实现中...
		</div>
	}
}
