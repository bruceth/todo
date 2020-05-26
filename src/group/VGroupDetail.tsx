import * as React from 'react';
import { CGroup } from "./CGroup";
import { VPage, Page, Edit, Schema, UiSchema, StringSchema, UiTextItem, UiTextAreaItem, ItemSchema, FA, QueryPager, UserView, UserIcon, Loading, Form, ButtonSchema, UiButton, Context, userApi, useUser, Tuid, List } from "tonva";
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export class VGroupDetail extends VPage<CGroup> {
	private groupMembersPager: QueryPager<any>;

    async open(groupMembersPager: QueryPager<any>) {
		this.groupMembersPager = groupMembersPager;
		this.openPage(this.page);
	}

	private onItemChanged = async (item:ItemSchema, value:any, prev:any) => {
		let {currentGroup} = this.controller;
		let props:any = {
			id: currentGroup.id,
		};
		switch (item.name) {
			case 'name':
				currentGroup.name = props.name = value;
				break;
			case 'discription':
				currentGroup.discription = props.discription = value;
				break;
		}
		await this.controller.saveGroupProp(props);
	}

	private onMember = (memberId:number) => {
		this.controller.cApp.showMemberDetail(memberId);
	}

	private renderMember = (member:any) => {
		let id:number = (typeof member === 'object')? member.id : member;
		return <div key={id} className="m-2 cursor-pointer"
			onClick={()=>this.onMember(id)}>
			<UserView id={id} render={user => {
				let {name, nick} = user;
				return 	<>
				<div className="w-3c h-3c rounded border ">
					<UserIcon id={id} className="w-100 h-100 rounded" />
				</div>
					<div className="w-3c d-inline-block text-truncate small text-muted text-center">
						<small>{nick || name}</small>
					</div>
				</>
			}} />
		</div>;
	}

	private onSubmitAddMember = async (name:string, context: Context) => {
		let user = await userApi.fromKey(context.data.user);
		if (!user) {
			context.setError('user', '账号不存在或者不接受邀请');
			return;
		}
		await this.controller.groupAddMember(user);
		this.controller.setGroup();
		useUser(user.id);
		this.groupMembersPager.items.push({member: user.id});
		this.closePage();
	}

	private onAddMember = () => {
		let schema:Schema = [
			{name: 'user', type: 'string', maxLength: 100, required: true} as StringSchema,
			{name: 'submit', type: 'submit'} as ButtonSchema,
		];
		let uiSchema: UiSchema = {
			items: {
				user: {widget:'text', label:'成员', placeholder: '请输入成员账号'} as UiTextItem,
				submit: {widget:'button', label:'提交', className: 'btn btn-primary'} as UiButton,
			}
		}
		this.openPageElement(<Page header="添加成员">
			<Form onButtonClick={this.onSubmitAddMember}
				onEnter={this.onSubmitAddMember}
				className="m-5 px-5 py-3 bg-white" 
				schema={schema} uiSchema={uiSchema} />
		</Page>);
	}

	@observable disabled:boolean = true;
	private listRemoveMember:List;
	private renderRemoveButton = observer(()=> {
		return <button onClick={this.onRemoveMemberList}
			className="btn btn-sm btn-success mr-2 align-self-center"
			disabled={this.disabled}>删除</button>;
	});
	private renderRemoveMemberItem = (item:any, index:number):JSX.Element => {
		let {member} = item;
		let id:number = (typeof member === 'object')? member.id : member;
		//return <div key={index} className="p-3">{tv(item.member)}</div>;
		return <UserView id={id} render={user => {
			let {name, nick} = user;
			return 	<div className="d-flex align-items-center py-2">
				<div className="w-3c h-3c rounded border mx-3">
					<UserIcon id={id} className="w-100 h-100 rounded" />
				</div>
				<div className="">{nick || name}</div>
			</div>;
		}} />
	}
	private onRemoveMemberList = async () => {
		let members = this.listRemoveMember.selectedItems;
		await this.controller.groupRemoveMembers(members);
		let {items} = this.groupMembersPager;
		for (let m of members) {
			let index = items.findIndex(v => v.member === m.member);
			if (index>=0) items.splice(index, 1);
		}
		this.controller.setGroup();
		this.closePage();
	}
	private onSelectRemoveMember = (item:any, isSelected:boolean, anySelected:boolean) => {
		this.disabled = anySelected===false;
	}
	private onRemoveMember = () => {
		this.openPageElement(<Page header="成员" right={<this.renderRemoveButton />}>
			<List ref={list=>this.listRemoveMember=list} items={this.groupMembersPager.items} item={{
				render: this.renderRemoveMemberItem, 
				onSelect: this.onSelectRemoveMember}} />
		</Page>);
	}

	private renderMemberAction = (icon:string, action:()=>void) => {
		let {currentGroup, user} = this.controller;
		if (Tuid.equ(currentGroup.owner, user.id) === false) return;
		return <div onClick={action}
			className="d-flex m-2 w-3c h-3c rounded border text-muted justify-content-center align-items-center cursor-pointer">
			<FA name={icon} />
		</div>;
	}

	private renderMembers = () => {
		let {items} = this.groupMembersPager;
		if (items === undefined) {
			return <Loading />;
		}
		let divMembers = [];
		for (let item of items) {
			divMembers.push(this.renderMember(item.member));
		}
		return <div className="mb-3 bg-white d-flex flex-wrap p-2">
			{divMembers}
			{this.renderMemberAction('plus', this.onAddMember)}
			{this.renderMemberAction('minus', this.onRemoveMember)}
		</div>;
	}

	private schema: Schema = [
		{name: 'name', type: 'string', maxLength: 100 } as StringSchema,
		{name: 'discription', type: 'string', maxLength: 1000} as StringSchema
	];
	private uiSchema: UiSchema = {
		items: {
			name: {
				label: '组名称',
				widget: 'text',
			} as UiTextItem,
			discription: {
				label: '组公告',
				widget: 'textarea',
			} as UiTextAreaItem
		}
	};
	//@observable private detail: any;
	private page = observer(():JSX.Element => {
		let {currentGroup} = this.controller;
		return <Page header="详情">
			{this.renderMembers()}
			<Edit schema={this.schema} uiSchema={this.uiSchema} data={currentGroup}
				onItemChanged={this.onItemChanged} />
		</Page>;
	});
}
