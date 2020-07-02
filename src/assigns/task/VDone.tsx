import React from "react";
import { VTask } from "./VTask";
import { Todo, AssignItem } from "models";
import { MemoInputProps, VMemoInput } from "assigns/VMemoInput";
import { FA, Page } from "tonva";
import { observer } from "mobx-react";
import { observable } from "mobx";

export class VDone extends VTask {
	header() {return '完成'}

	protected renderMore() {
		let enabled = this.calcEnabled(this.task.todos);
		return <div className="mt-3 text-center">
			<button className="btn btn-success" onClick={this.done} disabled={!enabled}>确认完成</button>
		</div>
	}

	private calcEnabled(todos: Todo[]):boolean {
		if (todos === undefined || todos.length === 0) return true;
		for (let todo of todos) {
			let {done} = todo;
			if (done === undefined || done === 0) return false;
		}
		return true;
	}


	private done = async () => {
		// 暂时界面上不输入分数
		let point = 0;
		let comment:string;
		if (this.task) {
			await this.controller.doneTask(this.task.id, point, comment);
		}
		else {
			await this.controller.doneAssign(point, comment);
		}
		this.afterAct();
	}

	@observable private disabled: boolean;
	protected renderTodo (todo:Todo, index:number):JSX.Element {
		let {id, discription, done, doneMemo} = todo;
		let onCheckChanged = async (isChecked:boolean):Promise<void> => {
			await this.controller.saveTodoDone(todo, isChecked?1:0);
			return;
		}
		let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
			if (!onCheckChanged) return;
			onCheckChanged(evt.target.checked);
		}
		let onEditMemo = () => {
			let {doneMemo} = todo;
			function compareStr(s1:string, s2:string):boolean {
				if (!s1) {
					if (!s2) return true;
					return false;
				}
				if (!s2) return false;
				return s1.length === s2.length;
			}
			this.disabled = true;
			this.openPageElement(React.createElement(observer(() => {
				let inputText:string = doneMemo;
				let onClickSave = async () => {
					if (this.disabled === true) return;
					inputText = inputText.trim();
					await this.controller.saveTodoDoneMemo(todo, inputText);
					todo.doneMemo = inputText;
					this.closePage();
				}
				let onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
					if (evt.keyCode === 13) onClickSave();
				}
				let onInputChange = (evt:React.ChangeEvent<HTMLInputElement>) => {
					inputText = evt.target.value;
					this.disabled = compareStr(doneMemo, inputText);
				}
				let right = <button className="btn btn-sm btn-success mr-2"
					disabled={this.disabled}
					onClick={onClickSave}>保存</button>;
				return <Page header="说明" back="close" right={right}>
					<div className="p-3">
						<input className="form-control" type="text"
							onChange={onInputChange} onKeyDown={onKeyDown}
							defaultValue={doneMemo} />
					</div>
				</Page>;
			})));
		}
		return <div className={'d-flex'}>
			<label key={id} className="flex-grow-1 px-3 py-2 m-0 d-flex bg-white cursor-point">
				<input className="mt-1 mr-3" type="checkbox" onChange={onChange} defaultChecked={done === 1}/>
				<div className="flex-grow-1">
					<div className="">{discription}</div>
					{doneMemo && <div className="mt-1 small">
						<FA name="comment-o" className="mr-2 text-primary" />
						<span className="text-info">{doneMemo}</span>
					</div>}
				</div>
			</label>
			<div className="p-2 cursor-pointer" onClick={onEditMemo}>
				<FA name="pencil-square-o" />
			</div>
		</div>
	}
	// {this.renderMemo(todo)}

	protected renderMemo(todo: Todo):JSX.Element {
		let props:MemoInputProps = {
			onUpdate: async (inputContent:string):Promise<void> => {
				await this.controller.saveTodoDoneMemo(todo, inputContent);
			},
			content: todo.doneMemo,
			placeholder: '添加说明'
		};
		return this.renderVm(VMemoInput, props);
	}

	protected renderAssignItem(item:AssignItem) {
		let {id, discription} = item;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return this.renderTodoWithCheck(id, discription, onCheckChanged, false);
	}
}
