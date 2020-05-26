import React from 'react';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { View, FA, List } from "tonva";
import { CTask } from "./CTask";
import { AssignItem } from 'models';

interface AssignInputItem {
	key: (ti: AssignInputItem) => any; // {return this.orderId};
	itemIndex: number;
	assignItem: AssignItem;
	removed: boolean;
}

function keyFunc(ti:AssignInputItem) {
	return ti.itemIndex;
}

export class VTodoList extends View<CTask> {
	private allowEdit: boolean = false;
	@observable private assignInputItems: AssignInputItem[] = [];
	/*
	@observable private assignInputItem: AssignInputItem;
	@observable private isInputing = false;
	private input: HTMLInputElement;
	*/

	init(items: AssignItem[], allowEdit:boolean = true) {
		this.allowEdit = allowEdit;
		items.forEach((v, index) => {
			this.assignInputItems.push({
				key: keyFunc,
				itemIndex: index + 1,
				assignItem: v,
				removed: false,
			});
		});
	}

	render():JSX.Element {
		let r = observer(()=> {
		let list:any;
		if (this.assignInputItems.length > 0) {
			list = <>
				<div className="border-bottom">
					<div className="mx-3 mb-1 small text-muted">事项</div>
				</div>
				<List className="border-bottom"
					items={this.assignInputItems}
					item={{
						render: this.renderTodo, 
						onClick:this.allowEdit===true ? this.onTodoClick : undefined
				}} />
			</>;
		}
		return list;
	});
	return React.createElement(r);
	}

	private renderTodo = (assignInputItem:AssignInputItem, index:number) => {
		return React.createElement(this.observableTodo, {assignInputItem});
	}

	private observableTodo = observer(({assignInputItem}: {assignInputItem:AssignInputItem}) => {
		let {assignItem, removed} = assignInputItem;
		let {discription} = assignItem;
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
			<div className="flex-fill">{discription}</div>
		</div>;
	});

	private onTodoClick = (assignInputItem: AssignInputItem) => {
		//this.state.assignInputItem = assignInputItem;
		//this.setTimeout();
	}


/*
	private onNewTodo = () => {
		this.isInputing = true;
	}

	private state: {
		ref: HTMLInputElement;
		blur: boolean;
		assignInputItem: AssignInputItem;
		remove: boolean;
	} = {
			ref: undefined,
			blur: false,
			assignInputItem: undefined,
			remove: false,
		};
	private timeoutHandler: any;
	private setTimeout() {
		if (this.timeoutHandler) clearTimeout(this.timeoutHandler);
		this.timeoutHandler = setTimeout(() => {
			let isInputing:boolean;
			let {ref, blur, remove, assignInputItem: todoItem} = this.state;
			if (remove === true) {
				isInputing = false;
			}
			if (blur === true) {
				isInputing = false
				this.assignInputItem = undefined;
			}
			if (todoItem !== undefined) {
				this.assignInputItem = todoItem;
				if (todoItem !== undefined) {
					if (this.input) this.input.value = todoItem.assignItem.discription;
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
					if (this.assignInputItem) {
						this.input.value = this.assignInputItem.assignItem.discription;
					}
					this.input.focus();
				}
			}
			this.state.ref = undefined;
			this.state.blur = false;
			this.state.remove = false;
			this.state.assignInputItem = undefined;
			if (isInputing !== undefined) this.isInputing = isInputing;
		}, 200);
	}
*/
/*
	private refInput = (input:HTMLInputElement) => {
		if (!input) return;
		if (window.getComputedStyle(input).visibility === 'hidden') return;
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
		if (this.assignInputItem !== undefined) {
			this.assignInputItem.removed = !this.assignInputItem.removed;
			this.assignInputItem = undefined;
		}
		this.setTimeout();
	}
	*/
/*
	private onEnter = async () => {
		let inputValue:string = this.input.value.trim();
		let todo = await this.controller.saveAssignItem(inputValue);
		let lowerValue = inputValue.toLowerCase();
		let assignItem = this.assignInputItems.find(v => lowerValue === v.assignItem.discription.toLowerCase());
		if (assignItem !== undefined) {
			assignItem.removed = true;
		}
		if (inputValue.length > 0) {
			if (this.assignInputItem !== undefined) {
				this.assignInputItem.assignItem.discription = this.input.value;
				this.assignInputItem = undefined;
				this.isInputing = false;
			}
			else {
				let ti:AssignInputItem = {
					key: keyFunc, 
					itemIndex: this.assignInputItems.length + 1,
					assignItem: todo,
					removed: false,
				};
				this.assignInputItems.push(ti);
			}
		}
		this.input.value = '';
	}
*/
/*
	footer() {
		let Footer = observer(() => {
			return  <div className="d-flex align-items-center py-1 px-3">
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
					{this.assignInputItem && <button 
						className="btn btn-sm btn-outline-primary ml-2"
						onClick={this.onRemove}>
						<FA name={this.assignInputItem.removed === true? 'undo' : 'trash'} />
					</button>}
				</>
				:
				<>
					<span className="flex-fill text-muted small">
						任务细化为可执行事项
					</span>
					<button className="btn btn-sm btn-outline-primary" onClick={this.onNewTodo}>
						<FA name="plus" /> 新增事项
					</button>
				</>
			}
			</div>;
		});
		return React.createElement(Footer);
	}
*/
}
