import React from "react";
import { Controller, View, FA } from "tonva";
import { observable, computed } from "mobx";
import { observer } from "mobx-react";

export interface MemoInputProps {
	onUpdate: (inputContent: string) => Promise<void>;
  content: string;
  placeholder:string;
}

export class VMemoInput<T extends Controller> extends View<T> {
	@observable protected isFocused: boolean = false;
  @observable protected inputContent: string;
  @computed get content() {
    let content : any = this.inputContent;
    if (content === undefined || content === null) {
      content = <small className="text-muted">{this.props.placeholder}</small>;
    }

    return content;
  }
	private props: MemoInputProps;

	render(props: MemoInputProps):JSX.Element {
    this.props = props;
    this.inputContent = props.content;
		return React.createElement(observer(() => this.isFocused === true?
			<div className="d-flex align-items-center">
				<input className="flex-fill form-control mr-1 mb-0" 
					type="text" ref={this.inputRef}
					onBlur={this.onBlur}
					onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
				<button onClick={this.onUpdateAction} disabled={!this.inputContent}
					className="btn btn-success">
						<FA name="save" />
				</button>
			</div>
			:
			<div className="cursor-pointer"
				onClick={() => this.isFocused = true}>
				{this.content}
			</div>
		));
	}

	protected input: HTMLInputElement;
	protected lostFocusTimeoutHandler: NodeJS.Timeout;
	protected onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.onUpdateAction();
		}
	}
	protected onBlur = (evt:React.FocusEvent<HTMLInputElement>) => {
		this.lostFocusTimeoutHandler = setTimeout(() => {
			this.lostFocusTimeoutHandler = undefined;
			this.isFocused = false;
    }, 200);
    if (this.inputContent != this.props.content && this.props?.onUpdate) {
      this.props.onUpdate(this.inputContent);
    }
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

	protected onUpdateAction = async () => {
		clearTimeout(this.lostFocusTimeoutHandler);
		if (!this.input) return;
		if (!this.inputContent) return;
		this.input.disabled = true;
		clearTimeout(this.lostFocusTimeoutHandler);
    if (this.inputContent != this.props.content && this.props?.onUpdate) {
      this.props.onUpdate(this.inputContent);
    }
    this.input.disabled = false;
    this.isFocused = false;
	}
}
