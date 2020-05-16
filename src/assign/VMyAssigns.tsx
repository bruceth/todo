import * as React from 'react';
import { CAssign } from './CAssign';
import { VPage, List, EasyTime, Muted, UserView, User, FA } from 'tonva';
import { Assign, AssignTask } from 'models';

export class VMyAssigns extends VPage<CAssign> {
	header() {
		return '布置的任务';
	}

	private renderItem = (assign:Assign, index:number) => {
		let {caption, discription, $update, tasks} = assign;
		return <div className="py-3 px-3">
			<div>
				<div>
					<b>{caption}</b> 
					&nbsp; {discription}
				</div>
				{this.renderAssignTasks(tasks)}
			</div>
			<div className="flex-fill"></div>
			<div>
				<Muted><EasyTime date={$update} /></Muted>
			</div>
		</div>;
	}

	private renderUser = (user: User) => {
		let {name, nick} = user;
		return <>{nick || name}</>;
	}

	private renderAssignTasks(tasks: AssignTask[]) {
		if (tasks === undefined || tasks.length === 0) return;
		return <div>
			{tasks.map((v, index) => {
				let {worker, state} = v;
				let t:string;
				switch (state) {
					default: t = '已领办'; break;
				}
				return <div className="small">
					<FA className="text-primary" name="arrow-circle-right" /> &nbsp;
					<UserView user={worker} render={this.renderUser} /> {t}
				</div>
			})}
		</div>;
	}

	private onAssignClick = (assign:Assign) => {
		this.controller.showAssign(assign.id);
	}

	content() {
		return <div>
			<List items={this.controller.myAssignsPager} 
				item={{render: this.renderItem, onClick: this.onAssignClick}} />
		</div>
	}
}
