import * as React from 'react';
import { VPage, ItemSchema, StringSchema, UiSchema, UiTextItem, UiRange, UiTextAreaItem, Edit, Schema, Context, NumSchema } from "tonva";
import { CAssign } from "./CAssign";
import { observer } from 'mobx-react';
import { VAssignItems } from './VAssignItems';
import { hourText } from 'tools';

export class VAssignEdit extends VPage<CAssign> {
	private vAssignItems: VAssignItems;

	init()
	{
		this.vAssignItems = new VAssignItems(this.controller);
		this.vAssignItems.init(this.controller.assign.items);
	}

	private onDiscriptionChanged = (context:Context, value:any, prev:any):Promise<void> => {
		return;
	}
	private onEditItemChanged = async (itemSchema: ItemSchema, value:any, prev:any):Promise<void> => {
		await this.controller.saveAssignProp(itemSchema.name, value);
		return;
	}

	private onPublishTask = async () => {
		await this.controller.publishAssign();
		this.closePage();
	}
	private schema:Schema = [
		{name:'caption', type:'string'} as StringSchema,
		{name:'point', type:'number'} as NumSchema,
		{name:'discription', type:'string'} as StringSchema,
	];
	private uiSchema:UiSchema = {
		items: {
			caption: {widget: 'text', label: '任务主题', labelHide: true} as UiTextItem,
			point: {
				widget: 'range', label: '工时分钟数', 
				min: 0, max: 10000, step: 1, 
				Templet: (value:any) => <>{hourText(value)}</>} as UiRange,
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
