import * as React from 'react';
import { observer } from 'mobx-react';
import { VPage, List, FA, tv, UserView, User, Image, EasyTime, Muted } from "tonva";
import { CJob, Doing } from './CJob';
import { Assign } from 'models';
import { stateText } from 'tapp';

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
			let none = <span className="p-3 text-success small">[无待办任务]</span>;
			return <>
				<div className="d-flex justify-content-around bg-white py-2">
					{this.renderCat(this.catTasks)}
					{this.renderCat(this.catAssigns)}
					{this.renderCat(this.catProject)}
				</div>
				<List className="my-2 bg-transparent" items={this.controller.myDoingsPager}
					item={{render: this.renderDoing, onClick: this.onClickDoing, key: this.keyDoing, className:"bg-transparent"}}
					none={none}
					/>
			</>
		});
		return React.createElement(page);
		/*<div className="px-3 pb-3">
			<button className="btn btn-primary" onClick={this.onTest}>test</button>		
		</div>*/
	}

	private keyDoing = (doing: Doing) => {
		return doing.task;
	}

	private onClickDoing = (doing: Doing) => {
		this.controller.showTask(doing.task);
	}

	private renderState(doing:Doing):JSX.Element {
		let {state, date} = doing;
		let pointer = <FA className="text-danger mr-1" name="chevron-circle-right" />;
		let {text, act} = stateText(state);
		return <>{pointer} <small>{text}</small> &nbsp; <Muted>{act}于<EasyTime date={date} /></Muted></>;
	}

	private renderDoing = (doing:Doing, index: number) => {
		let {assign, worker, $create} = doing;
		let renderIcon = (user:User) => {
			let {icon} = user;
			return <Image className="w-2c h-2c mt-1" src={icon} /> 
		};
		let renderNick = (user:User) => {
			let {name, nick} = user;
			return <small>{nick || name}</small>
		};
		return tv(assign, (values: Assign) => {
			let {caption, discription} = values;
			return <div className="my-1 bg-white">
				<div className="px-3 py-2">
					<UserView user={worker} render={renderIcon} />
				</div>
				<div className="flex-fill">
					<div className="d-flex pt-1 pb-2">
						<div className="flex-fill pl-2">
							<UserView user={worker} render={renderNick} />
							<div><b>{caption}</b> &nbsp; <Muted>{discription}</Muted></div>
						</div>
						<div className="pr-2"><Muted><EasyTime date={$create} /></Muted></div>
					</div>
					<div className="text-primary pl-2 py-1 border-top">{this.renderState(doing)}</div>
				</div>
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
		content: '作业', 
		action: this.controller.showMyAssigns,
	}
	private catTasks:Cat = {
		icon: 'list-ol',
		bgIcon: 'bg-info',
		content: '任务', 
		action: this.controller.showMyTasks,
	}
	private renderCat = (cat:Cat) => {
		let {icon, bgIcon, content, action} =cat;
		return <div className="py-2 px-3 d-flex bg-white align-items-center cursor-pointer" 
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
