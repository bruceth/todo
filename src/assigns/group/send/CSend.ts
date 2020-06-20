import { CSub } from "tonva";
import { CAssigns } from "assigns/CAssigns";
import { VSelectToList } from "./VSelectToList";
import { VSelectChecker } from "./VSelectChecker";
import { VSelectRater } from "./VSelectRater";
import { VSendOut } from "./VSendOut";
import { VSendBase } from "./VSendBase";

interface Step {
	caption: string;
	VPage: new (controller: CSend)=>VSendBase
}
export const steps:Step[] = [
	{caption: '指定执行人', VPage: VSelectToList},
	{caption: '指定检查人', VPage: VSelectChecker},
	{caption: '指定评价人', VPage: VSelectRater},
	{caption: '完成', VPage: VSendOut}
];

export class CSend extends CSub<CAssigns> {
	step: number = 0;

	protected async internalStart() {
		this.startAction();
		this.step = 0;
		this.openVPage(steps[0].VPage);
	}
/*
	showSelectToList = () => {
		this.openVPage(VSelectToList);
	}

	showSelectChecker = () => {
		this.openVPage(VSelectChecker);
	}

	showSelectRater = () => {
		this.openVPage(VSelectRater);
	}

	showSendOut = () => {
		this.openVPage(VSendOut);
	}
*/

	prev = () => {
		this.openVPage(steps[--this.step].VPage);
	}
	next = () => {
		this.openVPage(steps[++this.step].VPage);
	}

	sendout = () => {
		alert('发送出去');
		this.popToTopPage();
	}

	cancel = async () => {
		this.popToTopPage();
	}
}
