import React from 'react';
import { VPage, UserView, User, Image, Muted, EasyTime, FA } from 'tonva';
import { CAssign } from './CAssign';
import { Assign } from 'models';
import { hourText } from 'tools';

export class VAssign extends VPage<CAssign> {
	private assign:Assign;

	init() {
		this.assign = this.controller.assign;
	}

	private onTakeAssign = () => {
		this.controller.takeAssign();
	}

	header() {
		return '作业';
	}

	content():JSX.Element {
		let {caption, discription, owner, $create, $update, point} = this.assign;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		let renderTop = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-3 border-bottom">
				<Image className="w-2c h-2c" src={icon} /> 
				<div className="ml-3">
					<div>{nick || name}</div>
					<div><Muted><EasyTime date={$create} /> {spanUpdate}</Muted></div>
				</div>
			</div>;
		}
		let vHour = point && <Muted>({hourText(point)})</Muted>;
		return <>
			<div className="m-3 rounded border bg-white">
				<UserView user={owner} render={renderTop} />
				<div className="px-3 pt-2"><b>{caption}</b> &nbsp; {vHour}</div>
				<div className="px-3 pt-2 pb-3">{discription}</div>
				{this.renderItems()}
			</div>
			{this.renderTasks()}
			{this.renderCommands()}
		</>;
	}

	private renderItems():JSX.Element {
		let {items} = this.assign;
		if (items.length === 0) return;
		let icon = 'circle';
		let cnIcon = 'text-primary';
		return <div className="py-2 border-top">{items.map((v, index) => {
			let {discription} = v;
			return <div key={index} className="px-3 py-2 d-flex align-items-center">
				<small><small><FA name={icon} className={cnIcon} fixWidth={true} /></small></small>
				<div className="flex-fill ml-3">{discription}</div>
			</div>;
		})}
		</div>;
	}

	private showTask = async (taskId: number) => {
		await this.controller.showTask(taskId);
	}

	private renderTasks():JSX.Element {
		let {tasks} = this.assign;
		if (tasks.length === 0) return;
		return <div className="py-2 m-3 rounded border bg-white">
			<div className="border-top border-bottom px-3 bg-light"><Muted>已领办为任务</Muted></div>
			{
				tasks.map((v, index) => {
					let {worker, $create} = v;
					return <div key={index}
						className="px-3 py-2 d-flex cursor-pointer" 
						onClick={()=>this.showTask(v.id)}>
						<FA name="hand-paper-o mr-3 mt-2" className="text-info" fixWidth={true} />
						<div className="">
							{this.renderUser(worker)}
							<div>
								<EasyTime date={$create} />
								<span className="mx-3">领办</span>
							</div>
						</div>
					</div>;
				})
			}
		</div>;
	}

	private renderCommands():JSX.Element {
		let {open, tasks} = this.assign;
		switch (open) {
			default:
			case 0:
				break;
			case 1:
				if (tasks.length > 0) return;
				break;
			case 2:
				if (tasks.find(v => v.worker === this.controller.user.id)) return;
				break;
		}

		return <div className="m-3 px-3">
			<button className="btn btn-primary" onClick={this.onTakeAssign}>
				<FA className="mr-2" name="chevron-circle-right" />
				开始领办
			</button>
		</div>;
	}
}
