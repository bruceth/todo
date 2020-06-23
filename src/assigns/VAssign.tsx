import React from 'react';
import { VBase } from "./VBase";
import { CAssigns } from './CAssigns';
import { Muted, EasyTime, Image, UserView, FA, User, Page } from 'tonva';
import { hourText } from 'tools';
import { observer } from 'mobx-react';

export class VAssign<T extends CAssigns> extends VBase<T> {
	init(params: any) {
		super.init(params);
	}

	private onTakeAssign = () => {
		//this.controller.takeAssign();
		alert('this.controller.takeAssign()');
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
		let renderUser = (user:User):JSX.Element => {
			let {icon, name, nick} = user;
			let spanUpdate:any;
			if ($update.getTime() - $create.getTime() > 6*3600*1000) {
				spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
			}
			return <div className="d-flex px-3 py-2 border-top bg-white align-items-center text-muted">
				<Image className="w-1c h-1c mr-2" src={icon} />
				<span className="mr-2 small">{nick || name}</span>
				<span className="mr-3 small">创建于<EasyTime date={$create} /> {spanUpdate}</span>
			</div>;
		}
		return <UserView user={owner} render={renderUser} />;
	}

	protected renderFlow() {}

	protected vStopFlag = <FA name="square-o" className="text-danger small" />;

	protected renderDiscriptionContent() {
		let {discription} = this.assign;
		if (!discription) return;
		let parts = discription.split('\n');
		return <div className="bg-white px-3 py-2 border-top">
			{parts.map((v, index) => <div key={index} className="py-2">{v}</div>)}
		</div>;
	}

	protected renderDiscription(hasTitle:boolean = true) {
		let Disp = observer(() => {
			let {discription, owner, end} = this.assign;
			if (hasTitle === false || end === 1) {
				return this.renderDiscriptionContent();
			}
			if (this.isMe(owner) === true) {
				if (discription) {
					return <div>
						<div className="small muted pt-2 pb-1 px-3 cursor-pointer" onClick={this.editDiscription}>
							说明 <FA name="pencil-square-o ml-3" />
						</div>
						{this.renderDiscriptionContent()}
					</div>;
				}
				else {
					return <div className="bg-white border-top px-3 py-2 cursor-pointer" onClick={this.editDiscription}>
						<FA className="mr-3" name="pencil-square-o" /> <Muted>添加说明</Muted>
					</div>;
				}
			};
			return this.renderDiscriptionContent();
		});
		return React.createElement(Disp);
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

	protected renderTodos() {
		return <div className="small text-muted px-3 py-2">明细事项 [设计中...]</div>;
	}

	protected renderAssignTo() {return;}

	protected get selfDoneCaption():string {return '自己完成';}
	protected renderSelfDone() {
		return <div className="px-3 py-2 border-top bg-white cursor-pointer"
			onClick={this.controller.showDone}>
			<FA className="mr-3 text-primary" name="chevron-circle-right" fixWidth={true} /> {this.selfDoneCaption}
		</div>;
	}

	protected renderTasks() {return;}

	content():JSX.Element {
		return React.createElement(observer(() => {
			let {caption, discription, owner, $create, $update, point, toList, tasks, end} = this.assign;
			let isMe = this.isMe(owner);
			let vHour = point && <Muted>({hourText(point)})</Muted>;
			let toListSelfDone:any;
			if (isMe === true && toList.length === 0 && end === 0) {
				toListSelfDone = <>
					{this.renderAssignTo()}
					{this.renderSelfDone()}
				</>;
			}

			return <>
				{this.renderFrom()}
				{this.renderCaption()}
				{this.renderDiscription()}
				{this.renderTodos()}
				{toListSelfDone}
				{tasks.length > 0 && this.renderTasks()}
				{this.renderFlow()}
			</>;
		}));
	}

/*
	let spanUpdate:any;
	if ($update.getTime() - $create.getTime() > 6*3600*1000) {
		spanUpdate = <><Muted>更新:</Muted> <EasyTime date={$update} /></>;
	}
	let renderTop = (user:User):JSX.Element => {
		let {icon, name, nick} = user;
		return <div className="d-flex px-3 py-3 border-bottom">
			<Image className="w-2c h-2c" src={icon} /> 
			<div className="ml-3">
				<div>{nick || name}</div>
				<div><Muted><EasyTime date={$create} /> {spanUpdate}</Muted></div>
			</div>
		</div>;
	}
				{
					false && <>
						<div className="m-3 rounded border bg-white">
							<UserView user={owner} render={renderTop} />
							<div className="px-3 pt-2"><b>{caption}</b> &nbsp; {vHour}</div>
							<div className="px-3 pt-2 pb-3">{discription}</div>
							{this.renderItems()}
						</div>
						{this.renderTasks()}
						{this.renderCommands()}
					</>
				}

*/

	private renderItems():JSX.Element {
		let {items} = this.assign;
		if (items.length === 0) return;
		let icon = 'circle';
		let cnIcon = 'text-primary';
		return <div className="py-2 border-top">{items.map((v, index) => {
			let {discription} = v;
			return <div key={index} className="px-3 py-2 d-flex align-items-center">
				<small><small><FA name={icon} className={cnIcon} fixWidth={true} /></small></small>
				<div className="flex-fill ml-3">{discription}</div>
			</div>;
		})}
		</div>;
	}

	private renderTasksOld():JSX.Element {
		let {tasks} = this.assign;
		if (tasks.length === 0) return;
		let renderUser = (user:User) => {
			let {icon, name, nick} = user;
			return <>
				<Image className="w-1c h-1c" src={icon} /> 
				<span className="ml-3">{nick || name}</span>
			</>;
		}
		return <div className="py-2 m-3 rounded border bg-white">
			<div className="border-top border-bottom px-3 bg-light"><Muted>已领办为任务</Muted></div>
			{
				tasks.map((v, index) => {
					let {worker, $create} = v;
					return <div key={index}
						className="px-3 py-2 d-flex cursor-pointer" 
						onClick={()=>this.controller.showFlowDetail(v)}>
						<FA name="hand-paper-o mr-3 mt-2" className="text-info" fixWidth={true} />
						<div className="">
							<UserView user={worker} render={renderUser} />
							<div>
								<EasyTime date={$create} />
								<span className="mx-3">领办</span>
							</div>
						</div>
					</div>;
				})
			}
		</div>;
	}

	private renderCommands():JSX.Element {
		let {open, tasks} = this.assign;
		switch (open) {
			default:
			case 0:
				break;
			case 1:
				if (tasks.length > 0) return;
				break;
			case 2:
				if (tasks.find(v => v.worker === this.controller.user.id)) return;
				break;
		}

		return <div className="m-3 px-3">
			<button className="btn btn-primary" onClick={this.onTakeAssign}>
				<FA className="mr-2" name="chevron-circle-right" />
				开始领办
			</button>
		</div>;
	}
}
