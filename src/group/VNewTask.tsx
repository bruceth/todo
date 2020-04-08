import * as React from 'react';
import { VPage, Page, Form, ItemSchema, StringSchema, ButtonSchema, UiSchema, UiButton, Context, UiTextItem } from "tonva";
import { CGroup } from "./CGroup";
import { VTask } from './VTask';

export class VNewTask extends VPage<CGroup> {
    async open() {
		this.openPage(this.page);
	}

	private onTask = async (button:string, context:Context) => {
		this.closePage();
		let {caption} = context.data;
		// await 
		this.controller.newTask(caption);
		this.returnCall(true);
	}

	private afterBack = () => {
		this.returnCall(false);
	}

	private onNewTask = async (button:string, context:Context) => {
		let {caption} = context.data;
		this.controller.newTask(caption);
		this.closePage();
		this.openVPage(VTask);
	}

	private schema:ItemSchema[] = [
		{name: 'caption', type: 'string', required: true} as StringSchema,
		{name: 'submit', type: 'submit'} as ButtonSchema,
	];
	private uiSchema: UiSchema = {
		items: {
			caption: {
				widget: 'text',
				label: '主题',
			} as UiTextItem,
			submit: {
				widget: 'button',
				label: '下一步',
				className: 'btn btn-primary',
			} as UiButton,
		}
	}
	private page = () => {
		return <Page header="新任务" back="close" afterBack={this.afterBack}>
			<Form className="p-3" 
				onButtonClick={this.onNewTask}
				onEnter={this.onNewTask}
				schema={this.schema}
				uiSchema={this.uiSchema}
				fieldLabelSize={2} />
		</Page>;
	}
}