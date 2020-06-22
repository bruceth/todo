import * as React from 'react';
import classNames from 'classnames';
import { List, EasyTime, Muted, tv, TabProp, Tabs, FA, LMR, VPage } from 'tonva';
import { Assign, AssignTask } from 'models';
import { EnumTaskStep, stateText } from 'tapp';
import { CReport } from './CReport';

const cnIcon = "d-flex justify-content-center align-items-center rounded border border-info text-danger w-3c h-3c font-1-5c mr-3";
export class VMyTasks extends VPage<CReport> {
	header() { return '任务'; }

	private renderTaskItem = (stepText:string, myTaskItem: AssignTask, index:number) => {
		let {assign, $create, stepDate, stepComment, state} = myTaskItem;
		// eslint-disable-next-line
		let {me, act} = stateText(state);
		return tv(assign, (values:Assign) => {
			let {caption, discription} = values;
			let left = <div className={cnIcon}>{caption[0].toUpperCase()}</div>;
			let right = <div><Muted><EasyTime date={stepDate} always={true} /></Muted></div>;
			return <LMR className="py-3 px-3" left={left} right={right}>
				<div className="small text-muted pb-1">
					<FA className="text-danger mr-1" name="chevron-circle-right" />
					<span className="text-primary">{me}</span> &nbsp;
					<EasyTime date={$create} always={true} />开始
					<Muted>{stepComment}</Muted>
				</div>
				<div><b>{caption}</b> &nbsp; {discription}</div>
			</LMR>;
		});
	}

	private onTaskClick = (myTaskItem: AssignTask) => {
		this.controller.showTask(myTaskItem.id);
	}

	private cnTabSelected = (selected:boolean) => classNames({
		"bg-white border border-warning":selected,
		"border":!selected,
	},  'cursor-pointer px-4 py-2 rounded');
	private tabs:TabProp[] = [
		{
			name: 'todo',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>领办</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('领办', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.todo),
		},
		{
			name: 'done',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>完成</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('完成', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.done),
		},
		{
			name: 'check',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>查验</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('查验', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.check),
		},
		{
			name: 'rate',
			caption: (selected) => <div className={this.cnTabSelected(selected)}>评价</div>,
			content: () => <div>
				<List items={this.controller.myTasksPager} 
					item={{
						render: (item, index) => this.renderTaskItem('评价', item, index), 
						onClick: this.onTaskClick
					}} />
			</div>,
			onShown: () => this.controller.loadTaskArchive(EnumTaskStep.rate),
		},
	];

	content() {
		return <Tabs tabs={this.tabs} tabPosition="top" size="sm" />;
	}
}
