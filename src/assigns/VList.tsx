import React from 'react';
import { CAssigns, AssignItem } from "./CAssigns";
import { VPage, List, FA, Muted, EasyTime, User, Image, tv, UserView } from "tonva";
import { VBase } from "./VBase";
import { observer } from "mobx-react";
import { Doing, Assign } from 'models';
import { stateText } from 'tapp';
import { observable } from 'mobx';

export abstract class VList<T extends CAssigns> extends VBase<T> {
	header() {
		return this.controller.caption;
	}

	content() {
		let page = observer(() => {
			let none = <div className="px-3 py-2 text-muted small border-top">[无]</div>;
			return <>
				{this.renderDivTop()}
				<List className="bg-transparent" items={this.controller.assignItems}
					item={{render: this.renderAssignItem, onClick: this.onClickAssign, key: this.keyAssign, className:"bg-transparent"}}
					none={none}
					/>
				{this.renderDivBottom()}
			</>;
		});
		return React.createElement(page);
	}

	@observable private isFocused: boolean = false;
	@observable private inputContent: string;
	footer() {
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
	}

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

	private keyAssign = (doing: Doing) => {
		return doing.task;
	}

	private onClickAssign = (item: AssignItem) => {
		this.controller.showAssign(item.assign);
	}

	private renderState(doing:Doing):JSX.Element {
		let {state, date} = doing;
		let pointer = <FA className="text-danger mr-1" name="chevron-circle-right" />;
		let {text, act} = stateText(state);
		return <>{pointer} <small>{text}</small> &nbsp; <Muted>{act}于<EasyTime date={date} /></Muted></>;
	}

	private renderAssignItem = (item:AssignItem, index: number) => {
		let {assign} = item;
		return tv(assign, (values: Assign) => {
			let {caption} = values;
			return <div className="px-3 bg-white align-items-center">
				<div className="py-3">
					<FA className="text-info mr-3" name="circle-o" size="lg" fixWidth={true} /> 
				</div>
				<div className="py-2">
					<div>{caption}</div>
					{caption?.length>7 && <div>xxx dddd dassd ddd</div>}
				</div>
			</div>;
		});
	}
}
