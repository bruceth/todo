import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { VPage, Muted, EasyTime, UserView, User, useUser, Image, FA } from "tonva";
import { CTask } from "./CTask";
import { Task } from 'models';
import { EnumTaskState } from '../tapp';
import { VTodoList } from './VTodoList';

interface Command {
	//visible: ()=>boolean; //: boolean | IComputedValue<boolean>;
	action: (cmd: Command) => void;
	render: (cmd: Command) => JSX.Element;
}

export class VTask extends VPage<CTask> {
	private task: Task;
	private vTodoList: VTodoList;

	init() {
		this.task = this.controller.task;
		this.vTodoList = new VTodoList(this.controller);
		this.vTodoList.init(this.task.todos, false);
		useUser(this.task.assign.owner);
	}

	header() {
		return '任务';
	}

	private onTodo = async () => {
		await this.controller.todoTask();
		this.closePage();
	}

	private renderUser = (user: User) => {
		let {icon, name, nick} = user;
		return <><Image className="w-1-5c h-1-5c" src={icon} /> &nbsp; {nick || name}</>;
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

			{this.renderState()}
			{this.renderCommands()}
		</div>;
	}
	
	//@observable private step:EnumTaskStep = EnumTaskStep.author;
	//@observable private state:EnumTaskState = EnumTaskState.todo;

	// 已领办
	private onCmdDone = (cmd:Command) => {
		//this.state = EnumTaskState.start;
		this.controller.showTaskDone();
	}
	private cmdDone: Command = {
		//visible: () => {return this.state !== EnumTaskState.start},
		action: this.onCmdDone,
		render: cmd => {
			let {action} = cmd;
			return <button className="btn btn-primary" onClick={()=>action(cmd)}>
				办理
				<FA className="ml-2" name="angle-right" />
			</button>;
		}
	};

	/*
	private cmdComment: Command = {
		//visible: () => true,
		action: this.onCmdComment,
		render: cmd => {
			let {action} = cmd;
			return <div onClick={()=>action(cmd)}><FA name="commenting-o" /> 评论</div>
		}
	};
	*/

	private onCmdDo = () => {
		this.controller.showTaskDone();
	}
	private renderCmdDone():JSX.Element {
		if (this.task.state === EnumTaskState.todo) {
			return <button className="btn btn-primary" onClick={this.onCmdDo}>
				办理
				<FA className="ml-2" name="angle-right" />
			</button>;
		}
	}

	private onCmdCheck = () => {
		this.controller.showTaskCheck();
	}
	private renderCmdCheck():JSX.Element {
		if (this.task.state === EnumTaskState.done) {
			return <button className="btn btn-primary" onClick={this.onCmdCheck}>
				查验
				<FA className="ml-2" name="angle-right" />
			</button>;
		}
	}

	private onCmdEditTodos = () => {
		this.controller.showTaskDone();
	}
	private renderCmdEditTodos():JSX.Element {
		if (this.task.state === EnumTaskState.todo) {
			return <div className="cursor-pointer" onClick={this.onCmdEditTodos}>
				<FA name="pencil-square-o" /> 增减事项			
			</div>;
		}
	}

	private onCmdComment = () => {
		alert('评论正在实现中...');
	}
	private renderCmdComment():JSX.Element {
		return <div className="cursor-pointer" onClick={this.onCmdComment}><FA name="commenting-o" /> 评论</div>
	}

	private gap():JSX.Element {
		return <div className="ml-3 border-left" />;
	}

	private renderCommands():JSX.Element {
		return <div className="px-3 py-2 d-flex align-items-center">
			{this.renderCmdDone()}
			{this.gap()}
			{this.renderCmdCheck()}
			<div className="flex-fill"></div>
			{this.renderCmdEditTodos()}
			{this.gap()}
			{this.renderCmdComment()}
		</div>;
	};

	private renderState() {
		let {state} = this.task;
		let divState:any;
		switch (state) {
			case EnumTaskState.start: divState = this.renderStart(); break;
			case EnumTaskState.todo: divState = this.renderTodo(); break;
		}
		if (!divState) return;
		return <div className="px-3">
			{divState}
		</div>
	}

	private renderStart() {
		return <>
			<button className="btn btn-success" onClick={this.onTodo}>领办</button>
		</>;
	}

	private renderTodo() {
		return <>
			
		</>;
	}
}
