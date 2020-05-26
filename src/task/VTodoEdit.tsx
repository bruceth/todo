import React from 'react';
import { CTask } from "./CTask";
import { VPage, Muted, EasyTime, User, Image, UserView, List } from "tonva";
import { Todo } from 'models';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export class VTodoEdit extends VPage<CTask> {
	header() {return '增减事项'}
	content() {
		let {caption, discription, $create, $update, owner} = this.controller.task;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		let renderTop = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			return <div className="d-flex px-3 py-2 bg-light">
				<Image className="w-2c h-2c my-1" src={icon} /> 
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

			{this.renderTodoList()}
			<div ref={div => this.divBottom = div} />
		</div>;
	}

	private renderTodoList() {
		let {todos} = this.controller.task;
		
		return <List items={todos} item={{render: this.renderTodo}} />;
	}

	private renderTodo = (todo:Todo, index:number) => {
		let {discription} = todo;
		return <div className="px-3 py-2">
			{discription}
		</div>
	}

	@observable private ddd: boolean = false;
	footer() {
		let f = observer(() =><div className="bg-light p-3">
			<div>
				<button className="btn btn-primary" onClick={this.onSave}>保存并新增</button>
			</div>
			{this.ddd===true && <div>
				<button className="btn btn-primary" onClick={this.onDel}>压缩</button>
			</div>
			}
		</div>);
		return React.createElement(f);
	}

	private n:number = 1;
	private onSave = () => {
		let todo: Todo = {
			id: 1,
			task: this.controller.task.id,
			assignItem: null, 
			discription: 'aaaa' + this.n++,
			x: 0,
			$update: new Date()
		};
		this.ddd = true;
		this.controller.task.todos.push(todo);
		this.scrollToBottom();
	}

	private onDel = () => {
		this.ddd = false;
	}

	private divBottom:HTMLDivElement;
	private scrollToBottom() {
		setTimeout(() => {
			this.divBottom?.scrollIntoView();
		}, 100);
	}
}
