import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, List, FA, tv, UserView, User, Image, EasyTime, Muted } from "tonva";
import { CJob, Doing } from './CJob';
import { Assign } from 'models';
import { EnumTaskState } from 'tapp';

interface Cat {
	icon: string;
	bgIcon: string;
	content: any;
	action: () => void;
}

export class VJob extends VPage<CJob> {
    async open() {
		//this.openPage(this.page);
	}

	header() {return '工作'}

	content() {
		let page = observer(() => {
			return <>
				{this.renderCat(this.catProject)}
				{this.renderCat(this.catAssigns)}
				{this.renderCat(this.catTasks)}
				<List className="my-3" items={this.controller.myDoingsPager}
					item={{render: this.renderDoing, onClick: this.onClickDoing}} />
			</>
		});
		return React.createElement(page);
		/*<div className="px-3 pb-3">
			<button className="btn btn-primary" onClick={this.onTest}>test</button>		
		</div>*/
	}

	private onClickDoing = (doing: Doing) => {
		this.controller.showTask(doing.task);
	}

	private renderState(state:EnumTaskState):JSX.Element {
		let pointer = <FA className="text-danger mr-2" name="chevron-circle-right" />;
		switch (state) {
			default:
				return <>状态{state}未知</>;
			case EnumTaskState.todo:
				return <>{pointer} 待办</>;
			case EnumTaskState.done:
				return <>{pointer} 已办待核</>;
		}
	}

	private renderDoing = (doing:Doing, index: number) => {
		let {assign, worker, state, $create} = doing;
		let renderIcon = (user:User) => {
			let {icon} = user;
			return <Image className="w-1-5c h-1-5c mr-4 mt-1" src={icon} /> 
		};
		let renderNick = (user:User) => {
			let {name, nick} = user;
			return <>{nick || name}</>
		};
		return tv(assign, (values: Assign) => {
			let {caption, discription} = values;
			return <div className="px-3 py-2">
				<UserView user={worker} render={renderIcon} />
				<div className="flex-fill">
					<UserView user={worker} render={renderNick} />
					<div><b>{caption}</b> &nbsp; <Muted>{discription}</Muted></div>
					<div className="text-primary">{this.renderState(state)}</div>
				</div>
				<div><EasyTime date={$create} /></div>
			</div>;
		});
	}

	private showCatProject = () => {
		alert('projects');
	}

	private catProject:Cat = {
		icon: 'sitemap',
		bgIcon: 'bg-primary',
		content: '项目', 
		action: this.showCatProject,
	};
	private catAssigns:Cat = {
		icon: 'list-ol',
		bgIcon: 'bg-success',
		content: '布置的任务', 
		action: this.controller.showMyAssigns,
	}
	private catTasks:Cat = {
		icon: 'list-ol',
		bgIcon: 'bg-info',
		content: '经手的任务', 
		action: this.controller.showMyTasks,
	}
	private renderCat = (cat:Cat) => {
		let {icon, bgIcon, content, action} =cat;
		return <div className="py-2 d-flex bg-white align-items-center border-bottom cursor-pointer" 
			onClick={action}>
			<div className={'d-flex w-2-5c h-2-5c text-center mx-3 rounded text-white align-items-center justify-content-center ' + bgIcon}>
				<FA name={icon} fixWidth={true} size="lg" />
			</div>
			<div>{content}</div>
		</div>;
	}
	private onTest = () => {
		this.controller.testText();
	}
}
