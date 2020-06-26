import React from 'react';
import { CAssigns, AssignListItem } from "./CAssigns";
import { List, FA, tv } from "tonva";
import { VBase } from "./VBase";
import { observer } from "mobx-react";
import { Assign } from 'models';
import { observable } from 'mobx';
import { VFooterInput, FooterInputProps } from './VFooterInput';

export abstract class VList<T extends CAssigns> extends VBase<T> {
	@observable private endItemsVisible: boolean = false;
	header() {
		return this.controller.caption;
	}

	content() {
		let page = observer(() => {
			let {assignListItems: assignItems} = this.controller;
			//let none = <div className="px-3 py-2 text-muted small border-top">[无]</div>;
			return <>
				{this.renderDivTop()}
				{this.renderList('待办', this.renderAssignItem, assignItems)}
				{this.renderEndItems()}
				{this.renderDivBottom()}
			</>;
		});
		return React.createElement(page);
	}

	private renderList(caption:string, 
		renderItem: (item:any, index:number)=>JSX.Element, 
		assignItems: AssignListItem[]) 
	{
		let none = <div className="px-3 py-3 text-muted small border-top border-bottom d-flex align-items-center">
			<FA className="text-warning mr-3" name="circle-thin" />
			无{caption}任务
		</div>;
		return <List className="bg-transparent mb-3" items={assignItems}
			item={{
				render: renderItem, 
				onClick:this.onClickAssign, 
				key: this.keyAssign, 
				className:"bg-transparent"}}
			none={none}
		/>;
	}

	private onToggleEndItems = async () => {
		if (this.endItemsVisible === true) {
			this.endItemsVisible = false;
			this.controller.endListItems = undefined;
		}
		else {
			this.endItemsVisible = true;
			await this.controller.loadEndItems();
		}
	}
	private renderEndItems() {
		let btnToggle = (icon:string) => <button className="btn btn-info mx-3 my-2"
			onClick={this.onToggleEndItems}>
			<FA className="mr-2" name={icon} /> 已完成
		</button>;

		if (this.endItemsVisible === false) {
			return btnToggle('chevron-right');
		}
		return <>
			{btnToggle('chevron-down')}
			{this.renderList('完成', this.renderEndItem, this.controller.endListItems)}
		</>;
	}

//	@observable private isFocused: boolean = false;
//	@observable private inputContent: string;
	footer() {
		let props:FooterInputProps = {
			onAdd: async (inputContent:string):Promise<void> => {
				await this.controller.newAssign(inputContent);
				this.scrollToTop();
			},
			caption: '新增任务'
		};
		return this.renderVm(VFooterInput, props);
		/*
		let Footer = observer(() => this.isFocused === true?
			<div className="d-flex p-3 align-items-center border-top">
				<input className="flex-fill form-control mr-1 mb-0" 
					type="text" ref={this.inputRef}
					onBlur={this.onBlur}
					onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
				<button onClick={this.onAddAssign} disabled={!this.inputContent}
					className="btn btn-success">
						<FA name="plus" />
				</button>
			</div>
			:
			<div className="p-3 border-top"
				onClick={() => this.isFocused = true}>
				<FA className="mr-3 text-success" name="plus" />添加任务
			</div>
		);
		return React.createElement(Footer);
		*/
	}
	/*
	private input: HTMLInputElement;
	private lostFocusTimeoutHandler: NodeJS.Timeout;
	private onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.onAddAssign();
		}
	}
	private onBlur = (evt:React.FocusEvent<HTMLInputElement>) => {
		this.lostFocusTimeoutHandler = setTimeout(() => {
			this.lostFocusTimeoutHandler = undefined;
			this.isFocused = false;
		}, 200);
	}
	private onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.inputContent = this.input.value.trim();
	}
	private inputRef = (input:any) => {
		if (!input) return;
		if (window.getComputedStyle(input).visibility === 'hidden') return;
		this.input = input;
		this.input.focus();
		if (this.inputContent) this.input.value = this.inputContent;
	}

	private onAddAssign = async () => {
		clearTimeout(this.lostFocusTimeoutHandler);
		if (!this.input) return;
		if (!this.inputContent) return;
		this.input.disabled = true;
		clearTimeout(this.lostFocusTimeoutHandler);
		//this.inputed = false;
		await this.controller.newAssign(this.inputContent);
		this.input.value = '';
		this.inputContent = undefined;
		this.input.disabled = false;
		this.input.focus();
		this.scrollToTop();
	}
	*/

	private keyAssign = (assignItem: AssignListItem) => {
		return assignItem.assign.id;
	}

	private onClickAssign = (item: AssignListItem) => {
		this.controller.showAssign(item.assign);
	}

	private renderAssignItem = (item:AssignListItem, index: number) => {
		return this.renderAssignItemBase(item, false);
	}

	private renderEndItem = (item:AssignListItem, index: number) => {
		return this.renderAssignItemBase(item, true);
	}

	private renderAssignItemBase(item:AssignListItem, end:boolean) {
		let {assign} = item;
		let icon:string, color:string, textColor:string;
		if (end === true) {
			icon = 'check-circle-o';
			color = 'text-warning';
			textColor = 'text-muted';
		}
		else {
			icon = 'circle-o';
			color = 'text-info';
		}
		return tv(assign, (values: Assign) => {
			let {caption} = values;
			return <div className="px-3 bg-white align-items-center">
				<div className="py-3">
					<FA className={'mr-3 ' + color} name={icon} size="lg" fixWidth={true} /> 
				</div>
				<div className={'py-2 ' + textColor}>
					<div>{caption}</div>
				</div>
			</div>;
		});
	}
}
