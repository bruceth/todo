import React from 'react';
import { Muted, EasyTime, User, Image, UserView, List, FA } from "tonva";
import { Todo } from 'models';
import { observer } from 'mobx-react';
import { VBase } from './VBase';

export class VTodoEdit extends VBase {
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
			<div className="border-top border-bottom bg-light">
				{this.renderCommands()}
			</div>
			<div ref={div => this.divBottom = div} />
		</div>;
	}

	private renderTodoList() {
		let header = <div className="px-3 py-1 mt-4 bg-light"><Muted>事项</Muted></div>;
		return <List header={header} 
			items={this.controller.task.todos} 
			item={{render: this.renderTodoEdit}} />;
	}

	protected renderCommands() {
		return <div className="px-3 py-2 d-flex align-items-end">
			<div className="flex-grow-1"></div>
			<button className="btn btn-outline-primary" onClick={()=>this.closePage()}>
				完成返回
			</button>
		</div>;
		// <FA className="mr-2" name="chevron-left" />
	}

	private onTrashTodo = async (item:Todo) => {
		await this.controller.xTodo(item.id, 1);
		item.x = 1;
	}
	private onUndoTodo = async (item:Todo) => {
		await this.controller.xTodo(item.id, 0);
		item.x = 0;
	}
	private renderTodoEdit = (item:Todo, index:number) => {
		let render = observer(() => {
			let {discription, assignItem, x} = item;
			let textColor:string, dotColor:string, vDisp:any, dotIcon:string, actionIcon:string, onClick:()=>void;

			if (x === 0) {
				textColor = '';
				if (assignItem) {
					dotIcon = 'circle';
					dotColor = 'text-primary';
				}
				else {
					dotIcon = 'circle-o';
					dotColor = 'text-info';
				}
				vDisp = discription;
				onClick = ()=>this.onTrashTodo(item);
				actionIcon = 'trash';
			}
			else {
				textColor = 'text-muted';
				dotIcon = 'times-circle-o';
				dotColor = '';
				vDisp = <del>{discription}</del>;
				onClick = ()=>this.onUndoTodo(item);
				actionIcon = 'undo';
			}
			return <div className={'py-2 d-flex ' + textColor}>
				<small className="align-self-center"><small><FA name={dotIcon} className={'mx-3 ' + dotColor} fixWidth={true} /></small></small>
				<div className="flex-fill">{vDisp}</div>
				<div className="px-3 cursor-pointer" onClick={onClick}>
					<FA name={actionIcon} />
				</div>
			</div>
		});
		return React.createElement(render);
	}
	private onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) this.onEnter();
	}
	private onEnter = async () => {
		let input:HTMLInputElement = document.getElementById('$task-todo-input') as HTMLInputElement;
		if (!input) return;
		let val = input.value.trim();
		if (val.length === 0) return;
		await this.controller.addTodo(val)
		input.value = '';
	}
	footer() {
		let f = observer(() =><div className="bg-light border-top py-2 px-1 d-flex">
			<input id='$task-todo-input' className="flex-fill form-control"
				type="text" 
				placeholder="新增事项"
				onKeyDown={this.onKeyDown}
				/>
			<button className="btn btn-sm btn-outline-primary" onClick={this.onEnter}>
				<FA name="plus" />
			</button>
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
		//this.ddd = true;
		this.controller.task.todos.push(todo);
		this.scrollToBottom();
	}

	private onDel = () => {
		//this.ddd = false;
	}

	private divBottom:HTMLDivElement;
	private scrollToBottom() {
		setTimeout(() => {
			this.divBottom?.scrollIntoView();
		}, 100);
	}
}
