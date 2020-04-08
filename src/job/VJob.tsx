import * as React from 'react';
import { VPage, Page, List, FA, tv, LMR, EasyTime } from "tonva";
import { CJob } from './CJob';
import { observer } from 'mobx-react';
import { stateName } from 'tools';

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

	render() {
		return <this.page />;
	}
	
	private renderTodo = (todo:any, index: number) => {
		let {task, state, date} = todo;
		let left = <FA className="mr-3 text-info" name="hand-rock-o" size="lg" fixWidth={true} />;
		let right = <div className="small text-muted">{stateName(state)} <EasyTime date={date} /></div>
		return <LMR className="px-3 py-2 align-items-center" left={left} right={right}>{
			tv(task, (taskObj) => {
				let {templet} = taskObj;
				return tv(templet, templetValues => {
					let {discription} = templetValues;
					return <div>{discription}</div>;
				});
			})
		}</LMR>;
	}

	private onClickTodo = (item: any) => {
		this.controller.showTodo(item);
	}

	private showCatProject = () => {
		alert('projects');
	}

	private showCatTask = () => {
		alert('tasks');
	}

	private catProject:Cat = {
		icon: 'sitemap',
		bgIcon: 'bg-primary',
		content: '项目', 
		action: this.showCatProject,
	};
	private catTask:Cat = {
		icon: 'list-ol',
		bgIcon: 'bg-success',
		content: '任务', 
		action: this.showCatTask,
	}
	private renderCat = (cat:Cat) => {
		let {icon, bgIcon, content, action} =cat;
		return <div className="py-2 d-flex bg-white align-items-center border-bottom cursor-pointer" onClick={action}>
			<div className={'d-flex w-2-5c h-2-5c text-center mx-3 rounded text-white align-items-center justify-content-center ' + bgIcon}>
				<FA name={icon} fixWidth={true} size="lg" />
			</div>
			<div>{content}</div>
		</div>;
	}

	private page = observer(() => {
		return <Page header="工作">
			{this.renderCat(this.catProject)}
			{this.renderCat(this.catTask)}
			<List className="my-3" items={this.controller.myTodosList}
				item={{render: this.renderTodo, onClick: this.onClickTodo}} />
		</Page>
	});
}
