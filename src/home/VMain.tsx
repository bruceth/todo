import * as React from 'react';
import { VPage, FA, LMR, Page, Form, ItemSchema, Context, List, tv, EasyTime, UiSchema, UiTextItem } from 'tonva';
import { CHome } from './CHome';
import { observer } from 'mobx-react';
import { VTodos } from './VTodos';

export class VMain extends VPage<CHome> {
    async open(param?: any) {
	}

	private renderGroup = (item: any, index: number):JSX.Element => {
		let {group, time, unread, count} = item;
		return <div className="px-3 py-2">{tv(group, v => {
			let {name} = v;
			// <FA className="" name="building-o" />
			// {count && <Muted>({count}成员)</Muted>}
			let vCount:any, bg:string;
			if (count < 10) {
				vCount = <b style={{fontSize:'1.5rem'}} >{count}</b>;
				bg = 'bg-warning';
			}
			else if (count < 100) {
				vCount = <span style={{fontSize:'1.2rem'}} >{count}</span>;
				bg = 'bg-success';
			}
			else {
				vCount = <span className="position-relative" style={{fontSize:'1.2rem'}}>99<small className="position-absolute" style={{bottom:'-0.1rem', right:'-0.55rem'}}>+</small></span>;
				bg = 'bg-primary';
			}
			let left = <div className={'red-dot num mr-3 d-flex w-2-5c h-2-5c rounded align-items-center justify-content-center position-relative text-white ' + bg}>
				{vCount}
				{unread>0 && 
				<u className="">{unread >= 100? <>99<small>+</small></>:unread}</u>}
			</div>;
			let right = <small className="text-muted"><EasyTime date={time} /></small>;
			return <LMR className="w-100 align-items-center" left={left} right={right}>
				{name}
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
		let uiSchema:UiSchema = {
			items: {
				name: {
					label: '名称',
					placeholder: '输入工作群组名称'
				} as UiTextItem
			}
		}
		let right = <button onClick={this.onClickSend}
			className="btn btn-sm btn-success align-self-center mr-2">
			<FA name="paper-plane-o" />
		</button>;
		this.openPageElement(<Page header="新建群" right={right}>
			<div className="m-3">
				<Form ref={f => this.form = f} schema={schema} uiSchema={uiSchema}
					onButtonClick={this.onFormSubmit} />
			</div>
		</Page>);
	}

	private keyGroup = (item:any) => {
		let {group} = item;
		if (typeof group === 'object') return group.id;
		return group;
	}

	render() {
		let page = observer(() => {
			let {groupsPager, todosChanged} = this.controller;
			let {items} = groupsPager;
			let right = <button onClick={this.onClickAdd}
				className="btn btn-sm btn-primary align-self-center mr-2">
				<FA name="plus" />
			</button>;
			return <Page header="首页" headerClassName="bg-info" right={right}>
				{this.renderVm(VTodos)}
				<div className="py-2 d-flex bg-white align-items-center cursor-pointer mb-2" 
					onClick={this.controller.showMyTodos}>
					<div className={'red-dot mx-3 d-flex w-2-5c h-2-5c text-center rounded text-white align-items-center justify-content-center bg-info'}>
						<FA name="list-ol" fixWidth={true} size="lg" />
						{todosChanged===true && <u></u>}
					</div>
					<div>待办工作</div>
				</div>
				<List items={items} 
					item={{render:this.renderGroup, onClick: this.onClickGroup, key: this.keyGroup}}
					none={()=><>[无]</>} />
			</Page>;
		});
		return React.createElement(page);
	}
	
}
