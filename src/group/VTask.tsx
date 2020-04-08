import * as React from 'react';
import classNames from 'classnames';
import { VPage, Page, tv, FA, ItemSchema, StringSchema, UiSchema, UiTextItem, UiTextAreaItem, Edit, List, Schema } from "tonva";
import { CGroup } from "./CGroup";
import { Note, NoteObj, Todo } from './note';
import { observer } from 'mobx-react';
import { observable, IObservableArray } from 'mobx';

interface TodoItem {
	key: (ti: TodoItem) => any; // {return this.orderId};
	orderId: number;
	todo: Todo;
	removed: boolean;
}

function keyFunc(ti:TodoItem) {
	return ti.orderId;
}

export class VTask extends VPage<CGroup> {
	@observable private todoList: TodoItem[] = [];

	async open() 
	{
		this.controller.currentTask.todos.forEach((v, index) => {
			this.todoList.push({
				key: keyFunc,
				orderId: index + 1,
				todo: v,
				removed: false,
			});
		});
		this.openPage(this.page);
	}

	private onPropCaption = () => {
		
	}

	private onPropDiscription = () => {

	}

	private renderRow(content:any, action:()=>void):JSX.Element {
		return <div className="px-3 py-2 border-bottom bg-white cursor-pointer d-flex align-items-center">
			<div className="flex-fill">{content}</div>
			<div><FA name="angle-right" /></div>
		</div>
	}

	private renderTodo = (todoItem:TodoItem, index:number) => {
		return <this.observableTodo todoItem={todoItem} />;
	}

	private observableTodo = observer(({todoItem}: {todoItem:TodoItem}) => {
		let {orderId, todo, removed} = todoItem;
		let {content} = todo;
		let cn = 'd-flex py-2 align-items-center';
		let style:React.CSSProperties;
		let icon:string, cnIcon:string = 'mx-3 small ';
		if (removed === true) {
			cn += ' text-muted';
			style = {
				textDecoration: 'line-through'
			}
			icon = 'times';
			cnIcon += 'text-muted';
		}
		else {
			icon = 'circle';
			cnIcon += 'text-primary';
		}
		return <div className={cn} style={style}>
			<small><small><FA name={icon} className={cnIcon} fixWidth={true} /></small></small>
			<div className="flex-fill">{content}</div>
		</div>;
	});

	private onTodoClick = (todoItem:TodoItem) => {
		this.state.todoItem = todoItem;
		this.setTimeout();
	}

	private onNewTodo = () => {
		this.isInputing = true;
	}

	private state: {
		ref: HTMLInputElement;
		blur: boolean;
		todoItem: TodoItem;
		remove: boolean;
	} = {
			ref: undefined,
			blur: false,
			todoItem: undefined,
			remove: false,
		};
	private timeoutHandler: any;
	private setTimeout() {
		if (this.timeoutHandler) clearTimeout(this.timeoutHandler);
		this.timeoutHandler = setTimeout(() => {
			let isInputing:boolean;
			let {ref, blur, remove, todoItem} = this.state;
			if (remove === true) {
				isInputing = false;
			}
			if (blur === true) {
				isInputing = false
				this.todoItem = undefined;
			}
			if (todoItem !== undefined) {
				this.todoItem = todoItem;
				if (todoItem !== undefined) {
					if (this.input) this.input.value = todoItem.todo.content;
					isInputing = true;
					if (this.isInputing === true) this.input.focus();
				}
				else {
					isInputing = false;
				}
			}
			if (ref !== undefined) {
				this.input = ref;
				if (this.input) {
					if (this.todoItem) {
						this.input.value = this.todoItem.todo.content;
					}
					this.input.focus();
				}
			}
			this.state.ref = undefined;
			this.state.blur = false;
			this.state.remove = false;
			this.state.todoItem = undefined;
			if (isInputing !== undefined) this.isInputing = isInputing;
		}, 200);
	}

	private refInput = (input:HTMLInputElement) => {
		this.input = input;
		this.state.ref = input;
		this.setTimeout();
	}

	private onInputBlur = () => {
		this.state.blur = true;
		this.setTimeout();
	}

	private onInput = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) this.onEnter();
	}

	private onRemove = () => {
		this.state.remove = true;
		if (this.todoItem !== undefined) {
			this.todoItem.removed = !this.todoItem.removed;
			this.todoItem = undefined;
		}
		this.setTimeout();
	}

	private onEnter = () => {
		let inputValue:string = this.input.value.trim();
		let lowerValue = inputValue.toLowerCase();
		let todoItem = this.todoList.find(v => lowerValue === v.todo.content.toLowerCase());
		if (todoItem !== undefined) {
			todoItem.removed = true;
		}
		if (inputValue.length > 0) {
			if (this.todoItem !== undefined) {
				this.todoItem.todo.content = this.input.value;
				this.todoItem = undefined;
				this.isInputing = false;
			}
			else {
				let ti:TodoItem = {
					key: keyFunc, 
					orderId: this.todoList.length + 1,
					todo: {
						id: undefined,
						content: this.input.value,
						task: undefined,
						worker: undefined,
						state: undefined,
					},
					removed: false,
				};
				this.todoList.push(ti);
			}
		}
		this.input.value = '';
	}

	@observable private isInputing = false;
	@observable private todoItem: TodoItem;
	private input: HTMLInputElement;
	private schema:Schema = [
		{name:'caption', type:'string'} as StringSchema,
		{name:'discription', type:'string'} as StringSchema,
	];
	private uiSchema:UiSchema = {
		items: {
			caption: {widget: 'text', label: '任务主题', labelHide: true} as UiTextItem,
			discription: {
				widget: 'textarea', 
				label: '任务说明', labelHide: true,
				Templet: (value:any) => <>{value}</>
			} as UiTextAreaItem,
		}
	};
	private page = observer(() => {
		let {currentTask} = this.controller;
		//let {caption, discription, todos} = currentTask;
		let footer = <div className="d-flex align-items-center py-1 px-3">
			{
				this.isInputing === true?
				<>
					<input ref={this.refInput} className="flex-fill px-1"
						type="text" 
						placeholder="事项内容"
						onBlur={this.onInputBlur} 
						onKeyDown={this.onInput}
						/>
					<button className="btn btn-sm btn-outline-primary" onClick={this.onEnter}>
						<FA name="plus" />
					</button>
					{this.todoItem && <button 
						className="btn btn-sm btn-outline-primary ml-2"
						onClick={this.onRemove}>
						<FA name={this.todoItem.removed === true? 'undo' : 'trash'} />
					</button>}
				</>
				:
				<>
					<span className="flex-fill text-muted small">
						任务可以细化分解为事项
					</span>
					<button className="btn btn-sm btn-outline-primary" onClick={this.onNewTodo}>
						<FA name="plus" /> 新增事项
					</button>
				</>
			}
		</div>;

		let list:any;
		if (this.todoList.length > 0) {
			list = <>
				<div className="px-3 mt-3 mb-2 small text-muted">事项</div>
				<List items={this.todoList} 
					item={{render: this.renderTodo, onClick:this.onTodoClick}} />
			</>;
		}
		return <Page header="任务" footer={footer}>
			<div className="mb-3"></div>
			<Edit schema={this.schema} uiSchema={this.uiSchema} data={currentTask} />
			{list}
		</Page>;
	});
}