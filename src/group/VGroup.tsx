import * as React from 'react';
import classNames from 'classnames';
import { Page, VPage, tv, List, FA, Tuid } from 'tonva';
import { CGroup } from './CGroup';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { VNewTask } from './VNewTask';
import { Note, NoteTask } from './note';

export class VGroup extends VPage<CGroup> {
	@observable private inputed: boolean = false;
    async open() {
		this.openPage(this.page);
		this.scrollToBottom();
	}
	
	private scrollToBottom() {
		setTimeout(() => this.divBottom?.scrollIntoView(), 20);
	}

	private renderNote = (noteItem:Note, index:number):JSX.Element => {
		let {type, owner, obj} = noteItem;
		let isMe = (Tuid.equ(owner, this.controller.user.id));
		let cnBox = classNames({"align-items-end my-2": isMe, "align-items-start": !isMe}, "flex-column");
		let divBody = obj?
			(obj as NoteTask).renderAsNote(()=>this.onTaskClick(noteItem, obj))
			: 
			this.renderMessage(noteItem);
		return <div className={cnBox}>
			{isMe===false && <div className="small text-muted mt-2 mb-1">{owner}</div>}
			{divBody}
		</div>;
	}

	private renderMessage = (noteItem:any) => {
		let {content, owner} = noteItem;
		let isMe = (Tuid.equ(owner, this.controller.user.id));
		let cnDiv = classNames('p-3 rounded', {"bg-white": !isMe});
		let bgStyle:{[prop:string]:string} = {maxWidth:'75%'};
		if (isMe === true) bgStyle['backgroundColor'] = '#8f8';
		return <div className={cnDiv} style={bgStyle}>{content}</div>;
	}

	private onTaskClick = async (noteItem:any, task:any) => {
		this.controller.showEditTask(noteItem, task);
	}

	private addNote = async () => {
		if (!this.input) return;
		let content:string = this.input.value;
		this.input.value = '';
		this.inputed = false;
		await this.controller.addNote(content);
		this.scrollToBottom();
	}

	private divBottom: HTMLElement;
	private refDivBottom = (divButtom:HTMLElement) => {
		this.divBottom = divButtom;
	};

	private input: HTMLInputElement;
	private onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.addNote();
		}
	}

	private onInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
		this.inputed = evt.target.value.trim().length > 0;
	}

	private showCommands = () => {
		this.controller.commandsShown = !this.controller.commandsShown;
		if (this.controller.commandsShown) {
			this.scrollToBottom();			
		}
	}

	private taskTodo = async () => {
		this.input.value = '';
		this.inputed = false;
		let ret = await this.controller.vCall(VNewTask);
		if (ret === true) this.scrollToBottom();
	}

	private onListFocus = (evt: React.FocusEvent<HTMLUListElement>) => {
		this.controller.commandsShown = false;
	}

	private onDetail = () => {
		this.controller.showGroupDetail();
	}

    private page = observer(() => {
		let {currentGroup, groupNotesPager, commandsShown} = this.controller;
		//let {group} = groupItem;
		let cnFooter = classNames('w-100 d-flex flex-column justify-content-center', {
		});
		let cnInputRow = classNames("d-flex px-2 align-items-center py-1 border-top", 
			{
				'align-items-start':  commandsShown,
			});

		let right = <div className="d-flex px-3 align-items-center cursor-pointer"
			onClick={this.onDetail}>
			<FA name="ellipsis-h" />
		</div>;
		
		let footer = <div className={cnFooter}>
			<div className={cnInputRow}>
				<input className="flex-fill form-control mr-2 mb-0" 
					type="text" ref={v=>this.input=v} onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
				{
					this.inputed === true?
					<button onClick={this.addNote}
						className="btn btn-sm btn-success text-nowrap">
						发送
					</button>
					:
					<button onClick={this.showCommands}
						className="btn btn-sm btn-outline-dark">
						<FA name="plus" />
					</button>
				}
			</div>
			{
				commandsShown === true && <div className="d-flex flex-wrap px-3 py-4">
					<div className="cursor-pointer" onClick={this.taskTodo}>
						<div className="p-2 bg-white" style={{borderRadius:'0.6em'}}><FA name="tasks" size="lg" fixWidth={true} /></div>
						<div className="text-center mt-1 small text-muted"><small>任务</small></div>
					</div>
				</div>
			}
		</div>;

        return <Page header={tv(currentGroup, v => <>{v.name} ({v.count})</>)} footer={footer} right={right}>
			<List className="px-3 flex-fill job-notes-list" 
				items={groupNotesPager.items} 
				item={{render: this.renderNote}}
				onFocus={this.onListFocus} />
			<div id={groupNotesPager.bottomDiv} ref={this.refDivBottom} className="h-1c"></div>
        </Page>
    })
}
