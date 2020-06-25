import React from 'react';
import { VBase } from "./VBase";
import { CAssigns } from './CAssigns';
import { Muted, EasyTime, Image, UserView, FA, User, Page, useUser } from 'tonva';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { Assign } from 'models';

export const vStopFlag = <FA name="square-o" className="text-danger small" />;

export abstract class VAssign<T extends CAssigns> extends VBase<T> {
	protected assign: Assign; // {return this.controller.assign;}

	init(params?: any) {
		this.assign = this.controller.assign;
		useUser(this.assign.owner);
	}

	header() {return '任务详情';}

	protected renderCaption() {
		let {caption, end} = this.assign;
		let icon = end === 1? 'check-circle-o' : 'circle-o';
		return <div className="bg-white p-3 d-flex align-items-center">
			<FA className="mr-3 text-success" name={icon} size="lg" />
			<b>{caption}</b>
		</div>;
	}

	protected renderFrom() {
		let {owner, $create, $update} = this.assign;
		let spanUpdate:any;
		if ($update.getTime() - $create.getTime() > 6*3600*1000) {
			spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
		}
		return <div className="d-flex px-3 py-2 border-top bg-white align-items-center text-muted">
			<small>{this.renderUser(owner)}</small>
			<span className="mr-3 small">创建于<EasyTime date={$create} /> {spanUpdate}</span>
		</div>;
	}

	protected renderDiscription() {
		let {discription} = this.assign;
		if (!discription) return;
		let parts = discription.split('\n');
		return <div className="bg-white px-3 py-2 border-top">
			{parts.map((v, index) => <div key={index} className="py-2">{v}</div>)}
		</div>;
	}

	protected renderTodos() {
		let {items} = this.controller.assign;
		let icon = 'circle';
		let cnIcon = 'text-primary';
		if (items.length === 0) return null;
		//<div className="small text-muted px-3 py-2">事项</div>
		return <div className="">
			{items.map((v, index) => {
				let {discription} = v;
				return <div key={index} className="px-3 py-2 d-flex align-items-center bg-white border-top">
					<small><small><FA name={icon} className={cnIcon} fixWidth={true} /></small></small>
					<div className="flex-fill ml-3">{discription}</div>
				</div>
			})}
		</div>;
	}

	content():JSX.Element {
		return React.createElement(observer(() => this.renderContent()));
	}

	protected renderContent() {
		return <>
			{this.renderFrom()}
			{this.renderCaption()}
			{this.renderDiscription()}
			{this.renderTodos()}
		</>;
	}
	/*
	{this.renderDraft()}
	{tasks.length > 0 && this.renderTasks()}
	{this.renderFlow()}
	*/
}

export class VAssignDraft<T extends CAssigns> extends VAssign<T> {
	protected renderContent() {
		return <>
			{super.renderContent()}
			<div className="pt-3">
				{this.renderDraft()}
			</div>
		</>;
	}

	protected get selfDoneCaption():string {return '自己完成';}
	protected renderSelfDone() {
		return <div className="px-3 py-2 border-top bg-white cursor-pointer"
			onClick={this.controller.showDone}>
			<FA className="mr-3 text-primary" name="chevron-circle-right" fixWidth={true} /> {this.selfDoneCaption}
		</div>;
	}

	protected renderDraft() {
		return this.renderSelfDone()
	}

	protected renderDiscription() {
		return React.createElement(observer(() => {
			let {discription} = this.assign;
			if (discription) {
				return <div>
					<div className="small muted pt-2 pb-1 px-3 cursor-pointer" onClick={this.editDiscription}>
						说明 <FA name="pencil-square-o ml-3" />
					</div>
					{super.renderDiscription()}
				</div>;
			}
			else {
				return <div className="bg-white border-top px-3 py-2 cursor-pointer" onClick={this.editDiscription}>
					<FA className="mr-3" name="pencil-square-o" /> <Muted>添加说明</Muted>
				</div>;
			}
		}));
	}

	private editDiscription = () => {
		let textarea:HTMLTextAreaElement;
		let saveDiscription = async () => {
			let disc = textarea.value;
			await this.controller.saveAssignDiscription(disc);
			this.assign.discription = disc;
			this.closePage();
		}
		let right = <button className="btn btn-sm btn-success mr-2" onClick={saveDiscription}>保存</button>;
		let {discription} = this.assign;
		this.openPageElement(<Page header="说明" right={right}>
			<div className="m-3 border">
				<textarea ref={v => textarea = v} className="w-100 border-0 form-control" 
					rows={8} defaultValue={discription} />
			</div>
		</Page>);
	}

	@observable private isFocused: boolean = false;
	@observable private inputContent: string;
	footer() {
		let {assign} = this.controller;
		if (!this.isMe(assign?.owner)) {
			return null;
		}
		let {tasks} = assign;
		if (tasks.length > 0) return null;
		let Footer = observer(() => this.isFocused === true?
			<div className="d-flex p-3 align-items-center border-top">
				<input className="flex-fill form-control mr-1 mb-0" 
					type="text" ref={this.inputRef}
					onBlur={this.onBlur}
					onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
				<button onClick={this.onAddAssignItem} disabled={!this.inputContent}
					className="btn btn-success">
						<FA name="plus" />
				</button>
			</div>
			:
			<div className="p-3 border-top"
				onClick={() => this.isFocused = true}>
				<FA className="mr-3 text-success" name="plus" />添加事项
			</div>
		);
		return React.createElement(Footer);
	}

	private input: HTMLInputElement;
	private lostFocusTimeoutHandler: NodeJS.Timeout;
	private onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.onAddAssignItem();
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

	private onAddAssignItem = async () => {
		clearTimeout(this.lostFocusTimeoutHandler);
		if (!this.input) return;
		if (!this.inputContent) return;
		this.input.disabled = true;
		clearTimeout(this.lostFocusTimeoutHandler);
		await this.controller.saveAssignItem(this.inputContent);
		this.input.value = '';
		this.inputContent = undefined;
		this.input.disabled = false;
		this.input.focus();
		this.scrollToTop();
	}
}

export class VAssignEnd<T extends CAssigns> extends VAssign<T> {
}
