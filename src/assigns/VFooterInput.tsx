import React from "react";
import { Controller, View, FA } from "tonva";
import { observable } from "mobx";
import { observer } from "mobx-react";

export interface FooterInputProps {
	onAdd: (inputContent: string) => Promise<void>;
	caption: string;
}

export class VFooterInput<T extends Controller> extends View<T> {
	@observable protected isFocused: boolean = false;
	@observable protected inputContent: string;
	private props: FooterInputProps;

	render(props: FooterInputProps):JSX.Element {
		this.props = props;
		return React.createElement(observer(() => this.isFocused === true?
			<div className="d-flex p-3 align-items-center border-top">
				<input className="flex-fill form-control mr-1 mb-0" 
					type="text" ref={this.inputRef}
					onBlur={this.onBlur}
					onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
				<button onClick={this.onAddAction} disabled={!this.inputContent}
					className="btn btn-success">
						<FA name="plus" />
				</button>
			</div>
			:
			<div className="p-3 border-top cursor-pointer"
				onClick={() => this.isFocused = true}>
				<FA className="mr-3 text-success" name="plus" />{this.props.caption}
			</div>
		));
	}

	protected input: HTMLInputElement;
	protected lostFocusTimeoutHandler: NodeJS.Timeout;
	protected onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.onAddAction();
		}
	}
	protected onBlur = (evt:React.FocusEvent<HTMLInputElement>) => {
		this.lostFocusTimeoutHandler = setTimeout(() => {
			this.lostFocusTimeoutHandler = undefined;
			this.isFocused = false;
		}, 200);
	}
	protected onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.inputContent = this.input.value.trim();
	}
	protected inputRef = (input:any) => {
		if (!input) return;
		if (window.getComputedStyle(input).visibility === 'hidden') return;
		this.input = input;
		this.input.focus();
		if (this.inputContent) this.input.value = this.inputContent;
	}

	protected onAddAction = async () => {
		clearTimeout(this.lostFocusTimeoutHandler);
		if (!this.input) return;
		if (!this.inputContent) return;
		this.input.disabled = true;
		clearTimeout(this.lostFocusTimeoutHandler);
		//await this.controller.saveAssignItem(this.inputContent);
		//this.scrollToTop();
		if (this.props?.onAdd) this.props.onAdd(this.inputContent);
		this.input.value = '';
		this.inputContent = undefined;
		this.input.disabled = false;
		this.input.focus();
	}
}
