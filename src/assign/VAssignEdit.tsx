import * as React from 'react';
import { hourText } from 'tools';
import { VPage, ItemSchema, StringSchema, UiSchema, UiTextItem, UiRange, UiTextAreaItem, Edit, Schema, Context, NumSchema, IdSchema, UiIdItem, tv } from "tonva";
import { CAssign } from "./CAssign";
import { observer } from 'mobx-react';
import { VAssignItems } from './VAssignItems';
import { ProjectItem } from '../project';

export class VAssignEdit extends VPage<CAssign> {
	private vAssignItems: VAssignItems;

	init()
	{
		this.vAssignItems = new VAssignItems(this.controller);
		this.vAssignItems.init(this.controller.assign.items);
	}

	private onDiscriptionChanged = async (context:Context, value:any, prev:any):Promise<void> => {
		return;
	}

	private onEditItemChanged = async (itemSchema: ItemSchema, value:any, prev:any):Promise<void> => {
		if (itemSchema.name === 'project') {
			await this.controller.saveAssignProject(value);
		}
		else {
			await this.controller.saveAssignProp(itemSchema.name, value);
		}
		return;
	}

	private onProjectChanged = async (context:Context, value:any, prev:any):Promise<void> => {
		return;
	}

	private onPublishTask = async () => {
		await this.controller.publishAssign();
		this.closePage();
	}
	private intRule = (value:any): string[] | string  => {
		let n = Number(value);
		if (isNaN(n) === true || Number.isInteger(n) === false) {
			return '请输入整数';
		}
	}
	private pickProject = async (context:Context, name:string, value:number):Promise<any> => {
		// return new Promise<number>((resolve,reject) => {
		// 	let onSelected = () => {
		// 		let projectId = 1;
		// 		resolve(projectId);
		// 	}
		// 	let afterBack = () => {
		// 		resolve(0);
		// 	}
		// 	this.openPageElement(<Page header="test" afterBack={afterBack}>
		// 		<button onClick={onSelected}>选中Project</button>
		// 	</Page>);
		// })
		let ret = await this.controller.cApp.showSelectProject();
		if (( ret === undefined) && value !== undefined) {
			return value;
		}
		return ret;
	}
	private schema:Schema = [
		{name:'caption', type:'string'} as StringSchema,
		{name:'point', type:'number'} as NumSchema,
		{name: 'project', type: 'id'} as IdSchema,
		{name:'discription', type:'string'} as StringSchema,
	];
	private uiSchema:UiSchema = {
		items: {
			caption: {widget: 'text', label: '任务主题', labelHide: true} as UiTextItem,
			point: {
				widget: 'range', label: '工时数', 
				min: 0, max: 10000, step: 1, 
				Templet: (value:any) => <>{hourText(value)}</>,
				rules: this.intRule,
				discription: '请按分钟数输入',
				discriptionClassName: 'text-success'
			} as UiRange,
			project: {
				widget: 'id',
				label: '项目',
				pickId: this.pickProject,
				Templet: (value:any) => {
					return tv(value, (v:ProjectItem) => {
						return <>{v.name}</>
					})
				},
				onChanged: this.onProjectChanged
			} as UiIdItem,
			discription: {
				widget: 'textarea', 
				label: '任务说明', labelHide: true,
				Templet: (value:any) => <>{value}</>,
				onChanged: this.onDiscriptionChanged
			} as UiTextAreaItem,
		}
	};
	header() {
		return '新任务';
	}
	right() {
		return <button className="btn btn-sm btn-success mr-1" onClick={this.onPublishTask}>发布</button>;
	}
	footer() {
		return this.vAssignItems.footer();
	}

	content() {
		let Content = observer(() => {
			let {assign} = this.controller;
			return <>
				<div className="mb-3"></div>
				<Edit schema={this.schema} uiSchema={this.uiSchema} data={assign} 
					onItemChanged={this.onEditItemChanged} />
				{this.vAssignItems.render()}
			</>;
		});
		return <Content />;
	}
}
