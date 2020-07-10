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
		if (!this.task) {
			return this.renderAssignItems();
		}
		let {todos} = this.task;
		if (todos.length === 0) return;
		return <div className="border-top border-bottom">
			<div className="border-bottom bg-light small py-1 px-3 text-muted">事项</div>
			<List items={todos} 
				item={{render: this.rendTodoListItem}} />
		</div>;
	}

	private rendTodoListItem = (todo:Todo, index:number) => {
		let {x} = todo;
		if (x === 1) return null;
		return this.renderTodo(todo, index);
	}

	protected renderTodo (todo:Todo, index:number):JSX.Element {
		let {discription, doneMemo, checkMemo} = todo;
		return <div className={'py-2 d-flex'}>
			<div className="mx-3">{this.renderTodoDot(todo)}</div>
			<div className="flex-fill">
				<div className="d-flex">
					<div className="flex-grow-1">
						<div className="flex-fill">{discription}</div>
						{doneMemo && <div className="mt-1 small">
							<FA name="comment-o" className="mr-2 text-primary" />
							<span className="text-info">{doneMemo}</span>
						</div>}
						{checkMemo && <div className="mt-1 small">
							<FA name="comments-o" className="mr-2 text-primary" />
							<span className="text-info">{checkMemo}</span>
						</div>}
					</div>
				</div>
			</div>
		</div>
	}

	protected renderTodoRadio(todo: Todo):JSX.Element {
		return <></>;
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
