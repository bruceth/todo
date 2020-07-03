import React from 'react';
import { VBase } from "./VBase";
import { CAssigns } from './CAssigns';
import { Muted, EasyTime, FA, Page, useUser } from 'tonva';
import { observer } from 'mobx-react';
import { Assign, AssignTask, AssignItem } from 'models';
import { VFooterInput, FooterInputProps } from './VFooterInput';
import { stateText } from 'tapp';

export const vStopFlag = <FA name="square-o" className="text-danger small" />;

export abstract class VAssign<T extends CAssigns> extends VBase<T> {
	protected assign: Assign;

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

	protected renderAssignItem(item:AssignItem) {
		let icon = 'circle';
		let cnIcon = 'text-primary';
		let {id, discription} = item;
		return <div key={id} className="pl-5 pr-3 py-2 d-flex align-items-center bg-white border-top">
			<small><small><FA name={icon} className={cnIcon} fixWidth={true} /></small></small>
			<div className="flex-fill ml-3">{discription}</div>
		</div>
	}

	protected renderTodoWithCheck(id:number, discription:string, onCheckChanged: (isChecked:boolean) => Promise<void>, isChecked:boolean) {
		let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
			if (!onCheckChanged) return;
			onCheckChanged(evt.target.checked);
		}
		return <label key={id}
			className="px-3 py-2 m-0 d-flex align-items-center bg-white border-top cursor-point">
			<input type="checkbox" onChange={onChange} defaultChecked={isChecked}/>
			<div className="flex-fill ml-3">{discription}</div>
		</label>
	}

	protected renderAssignItems():any {
		let {items} = this.controller.assign;
		return items.map((v, index) => this.renderAssignItem(v));
	}

	protected renderTodos() {
		return this.renderAssignItems();
	}

	protected renderTaskItem(task: AssignTask) {
		let {state, actionTime} = task;
		let {me} = stateText(state);
		return <>
			{me} <EasyTime date={actionTime} />
		</>
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
			<FA className="mr-3 text-danger" name="chevron-circle-right" fixWidth={true} /> {this.selfDoneCaption}
		</div>;
	}

	protected renderDraft() {
		return this.renderSelfDone()
	}

	protected renderDiscription() {
		return React.createElement(observer(() => {
			let {discription} = this.assign;
			let {isMyAssign} = this.controller;
			if (discription) {
				let vTitle:any;
				if (isMyAssign === true) {
					vTitle = <div className="small muted pt-2 pb-1 px-3 cursor-pointer" onClick={this.editDiscription}>
						说明 <FA name="pencil-square-o ml-3" />
					</div>
				}
				return <div>
					{vTitle}
					{super.renderDiscription()}
				</div>;
			}
			else if (isMyAssign) {
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

	footer() {
		if (!this.controller.isMyAssign) {
			return null;
		}
		let props:FooterInputProps = {
			onAdd: async (inputContent:string):Promise<void> => {
				await this.controller.saveAssignItem(inputContent);
				this.scrollToTop();
				return;
			},
			caption: '添加事项'
		};
		return this.renderVm(VFooterInput, props);
	}
}

export class VAssignEnd<T extends CAssigns> extends VAssign<T> {

	protected renderTodos() {
		let {tasks} = this.controller.assign;
		let my = tasks.find(v => this.isMe(v.worker));
		if (!my) {
			return super.renderTodos();
		}
		let {todos} = my;
		return todos.map((item, index) => {
			let {assignItem, discription, id} = item;
			let cn:string, icon:string;
			if (assignItem) {
				cn = 'text-primary';
				icon = 'circle';
			}
			else {
				cn = 'text-info';
				icon = 'circle-o'
			}
			return <div key={id} className="px-3 py-2 d-flex align-items-center bg-white border-top">
				<small><small><FA name={icon} className={cn} fixWidth={true} /></small></small>
				<div className="flex-fill ml-3">{discription}</div>
			</div>
		});
	}
}
