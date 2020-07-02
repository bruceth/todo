import React from 'react';
import { observer } from 'mobx-react';
import { VPage, FA, LMR, Page, Form, ItemSchema, Context, List, UiSchema, UiTextItem } from 'tonva';
import { CProject, ProjectItem } from "./CProject";

export class VProjectList extends VPage<CProject> {
	header() {return '项目'}
	right() {return <button onClick={this.onClickAdd}
		className="btn btn-sm btn-primary align-self-center mr-2">
		<FA name="plus" />
		</button>;
		}

	content() {
		return <>
			{React.createElement(this.projectListContent)}
		</>;
	}

	private projectListContent = observer(() => {
		let { projectsPager } = this.controller;
		return <>
			<List className="flex-fill bg-transparent" 
				items={projectsPager.items} 
				item={{render: this.renderProject}}
			/>
		</>		
	})

	private renderProject = (projectItem:ProjectItem, index:number):JSX.Element => {
		return <LMR className="py-3 px-3 mb-1 bg-white" >
			<div><b>{projectItem.name}</b> &nbsp; {projectItem.content}</div>
			</LMR>
	}

	private onClickProjectItem(item:ProjectItem) {
		this.controller.onSelectItem(item);
	}

	private onClickSend = () => {
		this.form.buttonClick('send');
	}

	private onFormSubmit = async (buttonName:string, context: Context) => {
		let {name, content} = context.data;
		let ret = await this.controller.saveProject(name, content);
		if (ret >  0) {
			this.closePage();
		}
	}

	private form: Form;
	private onClickAdd = () => {
		let schema:ItemSchema[] = [
			{name: 'name', type: 'string'},
			{name: 'content', type: 'string'}
		];
		let uiSchema:UiSchema = {
			items: {
				name: {
					label: '名称',
					placeholder: '输入项目名称'
				} as UiTextItem,
				content: { 
					label: '描述',
					placeholder: '输入项目描述'
				} as UiTextItem
			}
		}
		let right = <button onClick={this.onClickSend}
			className="btn btn-sm btn-success align-self-center mr-2">
			<FA name="paper-plane-o" />
		</button>;
		this.openPageElement(<Page header="新建项目" right={right}>
			<div className="m-3">
				<Form ref={f => this.form = f} schema={schema} uiSchema={uiSchema}
					onButtonClick={this.onFormSubmit} />
			</div>
		</Page>);
	}

}