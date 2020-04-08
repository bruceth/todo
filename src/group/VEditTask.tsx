import * as React from 'react';
import { VPage, Page, tv, FA } from "tonva";
import { CGroup } from "./CGroup";
import { stateDefs } from 'tools';
import { Note, NoteObj } from './note';

export class VEditTask extends VPage<CGroup> {
	private noteItem: Note;
	private todo:any;
	private acts:any[];
	private assess:any;

	async open({noteItem, task, todo, acts, assess}:
		{noteItem: Note, task: any, todo:any, acts:any[], assess:any}) 
	{
		this.noteItem = noteItem;
		this.todo = todo;
		this.acts = acts;
		this.assess = assess;
		this.openPage(this.page);
	}

	private onRevoke = async () => {
		await this.controller.revokeTask(this.noteItem);
		this.closePage();
	}

	private onPending = async () => {
		await this.controller.taskAct(this.noteItem, 10);
		this.closePage();
	}

	private onStart = async () => {
		await this.controller.taskAct(this.noteItem, 20);
		this.closePage();
	}

	private actButtons():{left:any[], right:any} {
		let ret:{left:any[], right:any} = {left:[], right:[]};
		let {left, right} = ret;
		let btnTodo = <button key="pending" className="btn btn-primary mr-3" onClick={this.onPending}>待办</button>;
		let btnDoing = <button key="start" className="btn btn-success mr-3" onClick={this.onStart}>开始</button>;
		if (!this.todo) {
			left.push(btnTodo, btnDoing);
			if (this.controller.user.id === this.noteItem.owner) {
				right.push(<button key="revoke" className="btn btn-outline-warning" onClick={this.onRevoke}>撤销</button>);
			}
		}
		else {
			switch (this.todo.state) {
				case stateDefs.start:
					left.push(btnTodo, btnDoing);
					break;
				case stateDefs.todo:
					left.push(btnDoing);
					break;
			}
		}
		return ret;
	}

	private page = () => {
		let {left, right} = this.actButtons();
		return <Page header="领办事项">
			<div className="m-3 bg-white">
				<div className="px-5 py-3">
					{this.renderTask()}
				</div>
				<div className="px-5 py-3 d-flex border-top">
					<div className="flex-fill">{left}</div>
					<div>{right}</div>
				</div>
			</div>
		</Page>;
	}

	private renderTask = ()=> {
		return (this.noteItem.obj as NoteObj).renderInView();
	}
}