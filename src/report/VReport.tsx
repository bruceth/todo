import * as React from 'react';
import { VPage, FA } from "tonva";
import { CReport } from './CReport';

interface Cat {
	icon: string;
	bgIcon: string;
	content: any;
	action: () => void;
}

export class VReport extends VPage<CReport> {
    async open() {
		//this.openPage(this.page);
	}

	header() {return '查看'}

	private showCatProject = () => {
		//		alert('projects');
		this.controller.cApp.showProjects();
	}

	private catMember:Cat = {
		icon: 'user-o',
		bgIcon: 'bg-info',
		content: '同事', 
		action: this.controller.cApp.cMember.showList,
	};

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
		action: undefined, // this.controller.showMyAssigns,
		//action: this.controller.showMyAssigns,
	}
	private catTasks:Cat = {
		icon: 'list-ol',
		bgIcon: 'bg-info',
		content: '任务', 
		action: this.controller.showMyTasks,
	}
	private items = [this.catMember, this.catTasks, this.catAssigns, this.catProject];
	content() {
		return <div className="">
			{this.items.map((cat, index) => {
				let {icon, bgIcon, content, action} =cat;
				return <div key={index} 
					className="d-flex py-2 px-3 cursor-pointer mb-1 bg-white align-items-center" 
					onClick={action}>
					<div className={'d-flex w-2c h-2c text-center mr-3 rounded text-white align-items-center justify-content-center ' + bgIcon}>
						<FA name={icon} fixWidth={true} size="lg" />
					</div>
					<div>{content}</div>
				</div>;
			})}
		</div>;
	}

	/*
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
	*/
}
