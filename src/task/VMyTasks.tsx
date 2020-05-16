import * as React from 'react';
import { CTask } from './CTask';
import { VPage, List, EasyTime, Muted, tv } from 'tonva';
import { Task, Assign, AssignTask } from 'models';

export class VMyTasks extends VPage<CTask> {
	header() {
		return '经手的任务';
	}

	private renderTaskItem = (myTaskItem: AssignTask, index:number) => {
		let {assign, worker, $create} = myTaskItem;
		return tv(assign, (values:Assign) => {
			let {caption, discription} = values;
			return <div className="py-3 px-3">
				<div>
					<div><b>{caption}</b></div>
					<div>{discription}</div>
				</div>
				<div className="flex-fill"></div>
				<div>
					<Muted><EasyTime date={$create} /></Muted>
				</div>
			</div>;
		});
	}

	private onTaskClick = (myTaskItem: AssignTask) => {
		this.controller.showTask(myTaskItem.id);
	}

	content() {
		return <div>
			<List items={this.controller.myTasksPager} 
				item={{render: this.renderTaskItem, onClick: this.onTaskClick}} />
		</div>
	}
}
