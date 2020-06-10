import React from 'react';
import { VPage } from "tonva";
import { CMember } from "./CMember";

export class VDepartmentList extends VPage<CMember> {
	header() {return '单位'}
	content() {
		return <div className="p-3">按单位查看同事 正在实现中...</div>;
	}
}
