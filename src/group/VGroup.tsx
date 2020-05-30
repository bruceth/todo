import * as React from 'react';
import classNames from 'classnames';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { VPage, tv, List, FA, Tuid, EasyTime, Scroller, UserView, User, Image } from 'tonva';
import { CGroup } from './CGroup';
import { NoteItem } from './NoteItem';
import { Group } from 'models';

export class VGroup extends VPage<CGroup> {
	@observable private inputed: boolean = false;

	init() {
		this.scrollToBottom();
	}
	private scrollToBottom() {
		setTimeout(() => {
			this.divBottom?.scrollIntoView();
		}, 100);
	}

	private renderTime(noteItem:NoteItem, index:number):JSX.Element {
		let {$create} = noteItem;
		if (index > 0) {
			let lastNoteItem:NoteItem;
			lastNoteItem = this.controller.groupNotesPager.items[index-1];
			if ($create.getTime() - lastNoteItem.$create.getTime() < 2 * 60 * 1000) {
				return;
			}
		}
		return <div className="pt-3 text-muted small text-center"><EasyTime date={$create} /></div>
	}

	private renderNote = (noteItem:NoteItem, index:number):JSX.Element => {
		let {owner} = noteItem;
		let isMe = (Tuid.equ(owner, this.controller.user.id));
		let vNote: any;
		if (isMe === true) {
			vNote = <div className="d-flex flex-column align-items-end my-2">
				{noteItem.renderAsNote()}
			</div>
		}
		else {
			vNote = <UserView user={owner} render={(values:User)=> {
				let {icon, nick, name} = values;
				return <div className="d-flex align-items-start my-2">
					<Image src={icon} className="w-2c h-2c mr-3" />
					<div className="flex-fill d-flex flex-column align-items-start">
						<div className="small text-muted mb-1">{nick || name}</div>
						{noteItem.renderAsNote()}
					</div>
				</div>
			}} />;
		}
		return <div className="d-block">
			{this.renderTime(noteItem, index)}
			{vNote}
		</div>;
	}

	private inputRef = (input:any) => {
		if (!input) return;
		if (window.getComputedStyle(input).visibility === 'hidden') return;
		this.input = input;
	}

	private addTextNote = async () => {
		if (!this.input) return;
		let content:string = this.input.value;
		this.input.value = '';
		this.inputed = false;
		await this.controller.addTextNote(content);
		this.scrollToBottom();
	}

	
	private divBottom: HTMLElement;
	private refDivBottom = (divButtom:HTMLElement) => {
		this.divBottom = divButtom;
	};

	private input: HTMLInputElement;
	private onKeyDown = (evt:React.KeyboardEvent<HTMLInputElement>) => {
		if (evt.keyCode === 13) {
			this.addTextNote();
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
		let ret = await this.controller.showNewTask();
		if (ret === true) this.scrollToBottom();
	}

	private onListFocus = (evt: React.FocusEvent<HTMLUListElement>) => {
		this.controller.commandsShown = false;
	}

	private onDetail = () => {
		this.controller.showGroupDetail();
	}

	header() {
		let Header = observer(() => {
			let {currentGroup} = this.controller;
			return tv(currentGroup as any, (v:Group) => {
				let {name, count} = v;
				return <>{name} &nbsp; {count && <small>({count}成员)</small>}</>
			});
		});
		return <Header />;
	}
	footer() {
		let Footer = observer(() => {
			let {commandsShown} = this.controller;
			let cnFooter = classNames('w-100 d-flex flex-column justify-content-center', {
			});
			let cnInputRow = classNames("d-flex px-2 align-items-center py-1 border-top", 
				{
					'align-items-start':  commandsShown,
				});
			return <div className={cnFooter}>
				<div className={cnInputRow}>
					<input className="flex-fill form-control mr-2 mb-0" 
						type="text" ref={this.inputRef} 
						onKeyDown={this.onKeyDown} onChange={this.onInputChange} />
					{
						this.inputed === true?
						<button onClick={this.addTextNote}
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
							<div className="p-2 bg-white" style={{borderRadius:'0.6em'}}>
								<FA name="tasks" size="lg" fixWidth={true} />
							</div>
							<div className="text-center mt-1 small text-muted"><small>作业</small></div>
						</div>
					</div>
				}
			</div>
		});
		return <Footer />;
	}
	right() {
		return <div className="d-flex px-3 align-items-center cursor-pointer"
			onClick={this.onDetail}>
			<FA name="ellipsis-h" />
		</div>;
	}
	content() {
		let {groupNotesPager} = this.controller;		
		let bottomMark = observer(() => {
			return <div id={groupNotesPager.bottomDiv} 
				ref={this.refDivBottom} 
				className="h-1c" />
		});
		return <>
			<List className="px-3 flex-fill bg-transparent" 
				items={groupNotesPager.items} 
				item={{render: this.renderNote}}
				onFocus={this.onListFocus} />
			{React.createElement(bottomMark)}
		</>;
	}
	protected async onPageScrollTop(scroller: Scroller): Promise<boolean> {
		let ret = await this.controller.groupNotesPager.more();
		return ret;
	}
}
