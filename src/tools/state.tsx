import * as React from 'react';
import { FA } from 'tonva';

export enum stateDefs {
	start = 0,
	todo = 10,
	doing = 20,
	done = 30,
	verified = 40,
	canceled = 50,
};

const stateNames:{[state:number]:string} = {
	"0": "发布",
	"10": "待办",
	"20": "在办",
	"30": "已办",
	"40": "完成",
	"50": "取消",
};

const stateIcons:{[state:number]:JSX.Element} = {
	"0": <FA name="bullhorn" />,
	"10": <FA name="ellipsis-h" />,
	"20": <FA name="circle-o-notch" className="text-primary" />,
	"30": <FA name="flag" className="text-success" />,
	"40": <FA name="check-circle-o" className="text-waning" />,
	"50": <FA name="times" className="text-danger" />,
};

export function stateName(state: number):string {
	if (!state) state = 0;
	return stateNames[state];
}

export function stateIcon(state: number):JSX.Element {
	if (!state) state = 0;
	return stateIcons[state];
}
