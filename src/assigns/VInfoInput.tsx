import React from "react";
import classNames from 'classnames'
import { Controller, View, FA, Page } from "tonva";
import { observable } from "mobx";
import { observer } from "mobx-react";

export interface InfoInputProps {
	onUpdate: (inputContent: string) => Promise<void>;
  content: string;
  color:string;
}

export class VInfoInput<T extends Controller> extends View<T> {
  @observable private disabled: boolean;
  private inputText:string;
  private props: InfoInputProps;

  onEditInfo = () => {
    this.disabled = true;
    this.openPageElement(React.createElement(observer(() => {
      let onClickSave = async () => {
        if (this.disabled === true) return;
        let inputText = this.inputText.trim();
        await this.props.onUpdate(inputText);
        this.closePage();
      }
      let onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
        if (evt.keyCode === 13) onClickSave();
      }
      let onInputChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
        this.inputText = evt.target.value;
        this.disabled = this.props.content === this.inputText;
      }
      let right = <button className="btn btn-sm btn-success mr-2"
        disabled={this.disabled}
        onClick={onClickSave}>保存</button>;
      return <Page header="说明" back="close" right={right}>
        <div className="p-3">
          <input className="form-control" type="text"
            onChange={onInputChange} onKeyDown={onKeyDown}
            defaultValue={this.props.content} />
        </div>
      </Page>;
    })));
  }

  render(props: InfoInputProps):JSX.Element {
    this.props = props;
    this.inputText = this.props.content;

    return <div className="p-2 cursor-pointer" onClick={this.onEditInfo}>
      <FA name={classNames("pencil-square-o", this.props.color)} />
    </div>
  }

}
