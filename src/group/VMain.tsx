import * as React from 'react';
import { VPage, FA, LMR, Page, Form, ItemSchema, Context, List, tv, EasyTime } from 'tonva';
import { CGroup } from './CGroup';
import { observer } from 'mobx-react';

export class VMain extends VPage<CGroup> {
    async open(param?: any) {
	}

	private renderGroup = (item: any, index: number):JSX.Element => {
		let {group, time, unread} = item;
		let right = <small className="text-muted"><EasyTime date={time} /></small>;
		return <div className="px-3 py-2">{tv(group, v => {
			return <LMR className="w-100" right={right}>
				{v.name}
				&nbsp; {unread>0 && <span className="badge badge-pill badge-danger">{unread}</span>}
			</LMR>;
		})}</div>;
	}

	private onClickGroup = (item: any) => {
		this.controller.showGroup(item);
	}

	private onClickSend = () => {
		this.form.buttonClick('send');
	}

	private onFormSubmit = async (buttonName:string, context: Context) => {
		let {name, discription} = context.data;
		await this.controller.saveGroup(0, name, discription);
		this.closePage();
	}

	private form: Form;
	private onClickAdd = () => {
		let schema:ItemSchema[] = [
			{name: 'name', type: 'string'},
		];
		let right = <button onClick={this.onClickSend}
			className="btn btn-sm btn-success align-self-center mr-2">
			<FA name="paper-plane-o" />
		</button>;
		this.openPageElement(<Page header="新的" right={right}>
			<Form ref={f => this.form = f} schema={schema} onButtonClick={this.onFormSubmit} />
		</Page>);
	}

	render() {
		return <this.page />;
	}
	
	private page = observer(() => {
		let {groupsPager} = this.controller;
		let {items} = groupsPager;
		let right = <button onClick={this.onClickAdd}
			className="btn btn-sm btn-primary align-self-center mr-2">
			<FA name="plus" />
		</button>;
        return <Page header="首页" headerClassName="bg-info" right={right}>
			<List items={items} 
				item={{render:this.renderGroup, onClick: this.onClickGroup}}
				none={()=><>[无]</>} />
        </Page>;
    });
}
