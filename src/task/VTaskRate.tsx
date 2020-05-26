import * as React from 'react';
import { VPage, Muted, EasyTime, UserView, User, useUser, Image, FA } from "tonva";
import { CTask } from "./CTask";
import { Task } from 'models';
import { VTodoList } from './VTodoList';

export class VTaskRate extends VPage<CTask> {
	private task: Task;
	private vTodoList: VTodoList;

	init() {
		this.task = this.controller.task;
		this.vTodoList = new VTodoList(this.controller);
		this.vTodoList.init(this.task.todos, false);
		useUser(this.task.assign.owner);
	}

	header() {
		return '评价';
	}

	private onRate = async () => {
		await this.controller.rateTask();
		this.closePage(2);
	}

	content() {
		let {caption, discription, $create, $update, owner} = this.task;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		let renderTop = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-2 bg-light">
				<Image className="w-2c h-2c" src={icon} /> 
				<div className="ml-3">
					<div>{nick || name}</div>
					<div><Muted><EasyTime date={$create} /> {spanUpdate}</Muted></div>
				</div>
			</div>;
		}
		return <div className="bg-white">
			<UserView user={owner} render={renderTop} />
			<div className="px-3">
				<div className="py-2"><b>{caption}</b></div>
				{discription && <div className="">{discription}</div>}
			</div>

			<div className="pt-3">
				{this.vTodoList.render()}
			</div>
			<div className="d-flex align-items-center px-3 py-2">
				<button className="btn btn-success" onClick={this.onRate}>
					<FA className="mr-2" name="check-circle" /> 评价
				</button>
				<div className="flex-fill"></div>
			</div>
		</div>;
		/*<button className="btn btn-outline-danger" onClick={this.onFail}>
			<FA className="mr-2" name="times-circle" /> 不过
		</button>*/
}
	

}
