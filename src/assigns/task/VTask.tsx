import React from "react";
import { CAssigns } from "../CAssigns";
import { VAssign } from "../VAssign";
import { AssignTask, Todo } from "models";
import { List, FA } from "tonva";

export abstract class VTask extends VAssign<CAssigns> {
	protected task: AssignTask;

	init(task: AssignTask) {
		super.init();
		this.task = task;
	}

	protected get back():'close' {return 'close'}

	protected afterAct() {
		this.closePage(2);
		this.controller.showAssign();
	}

	protected renderContent() {
		return <div className="m-3">
			<div className="border rounded">
				{this.renderCaption()}
				{this.renderDiscription()}
				{this.renderTodos()}
			</div>
			{this.renderMore()}
		</div>
	}

	protected abstract renderMore():JSX.Element;


	protected renderTodos():JSX.Element {
		// 改写，根据Done来显示。每项加Checkbox
		//return super.renderTodos();
		let {todos} = this.task;
		if (!todos) {
			return <>请先获取task.todos</>;
		}

		return <div className="border-top border-bottom">
			<div className="border-bottom bg-light small py-1 px-3 text-muted">事项</div>
			<List items={todos} 
				item={{render: (todo:Todo, index:number) => this.renderTodo(todo, index)}} />
		</div>;
	}

	protected renderTodo (todo:Todo, index:number):JSX.Element {
		let {discription, x} = todo;
		if (x === 1) return null;
		return <div className={'py-2 d-flex'}>
			<div className="mx-3">{this.renderTodoDot(todo)}</div>
			<div className="flex-fill">
				<div className="d-flex">
					<div className="flex-fill">{discription}</div>
					{this.renderTodoRadio(todo)}
				</div>
				{this.renderMemo(todo)}
			</div>
		</div>
	}

	protected renderTodoRadio(todo: Todo):JSX.Element {
		return <>radio</>;
	}

	protected renderMemo(todo: Todo):JSX.Element {
		return <>memo</>;
	}

	protected renderMemoBase(memo:string, color:string, icon:string, caption:string): JSX.Element {
		/*
		if (vTodo === undefined) return;
		let {state} = this.task;
		switch (state) {
			case EnumTaskState.done:
				return;
		}
		let {check, checkMemo} = todo;
		if (check === undefined) return;		
		let {checkColor, checkText, checkIcon} = vTodo;
		*/
		if (!memo) return;
		return <div className="mt-1">
			<span className={'small text-' + color}>
				<span className="mr-3">
					<FA className="mr-1" name={icon} />
					<span className="text-muted">{caption}</span>
				</span>
				{memo}
			</span>
		</div>;
	}

	protected renderTodoDot(todo:Todo) {
		let {assignItem} = todo;
		let dotColor:string, dotIcon:string;
		if (assignItem) {
			dotIcon = 'circle';
			dotColor = 'text-black';
		}
		else {
			dotIcon = 'circle';
			dotColor = 'text-primary';
		}

		return <small><small><FA name={dotIcon} className={dotColor} fixWidth={true} /></small></small>;
	}
}
