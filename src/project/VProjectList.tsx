import React from 'react';
import { CProject } from "./CProject";
import { VPage } from "tonva";

export class VProjectList extends VPage<CProject> {
	header() {return '项目'}
	content() {
		return <div className="p-3">
			正在建设中...<br/>
			任务和作业都可以跟项目绑定
		</div>;
	}
}