import React from 'react';
import { VPage, List, UserView, User, Image, Muted } from "tonva";
import { CMember, MemberItem } from "./CMember";

export class VMemberList extends VPage<CMember> {
	header() {return '同事'}
	content() {
		return <List className="my-3" 
			items={this.controller.myMembersPager}
			item={{render:this.renderMemberItem, onClick:this.onMemberItem}}
			none="无"
		/>;
	}

	private renderMemberItem = (memberItem:MemberItem, index:number) => {
		let {member, count} = memberItem;
		let renderUser = (user:User) => {
			let {icon, nick, name} = user;
			return <div className="d-flex px-3 py-2">
				<Image className="w-2c h-2c mr-3" src={icon} />
				<div className="flex-fill">
					<div>{nick || name}</div>
					
				</div>
				<div>
					{count>0 && <Muted>{count}群</Muted>}
				</div>
			</div>
		}
		return <UserView user={member} render={renderUser} />
	}

	private onMemberItem = (userId:number) => {
		alert('member: ' + userId);
	}


}
