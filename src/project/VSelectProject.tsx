import React from 'react';
import { observer } from 'mobx-react';
import { VPage, FA, LMR, Page, Form, ItemSchema, Context, List, tv, EasyTime, UiSchema, UiTextItem } from 'tonva';
import { CSelectProject, ProjectItem } from "./CProject";

export class VSelectProject extends VPage<CSelectProject> {
  header() {return '选择项目'}

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
		return <LMR className="py-3 px-3 mb-1 bg-white" onClick={()=> this.onClickProjectItem(projectItem)}>
			<div><b>{projectItem.name}</b> &nbsp; {projectItem.content}</div>
			</LMR>
	}

  protected afterBack() {
    this.controller.onSelectItem(undefined);
  }

	private onClickProjectItem(item:ProjectItem) {
    this.controller.onSelectItem(item);
    this.controller.closePage();
	}
}