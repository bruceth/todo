import React from 'react';
import { VPage, List, Muted, FA } from "tonva";
import { CMember, MemberItem } from "./CMember";

export class VMain extends VPage<CMember> {
	header() {return '同事'}
	content() {
		let bgIcon = 'bg-info';
		let icon = 'building-o';
		return <>
			<div className="d-flex py-2 px-3 cursor-pointer mb-1 bg-white align-items-center"
				onClick={this.controller.showDepartment}>
				<div className={'d-flex w-2c h-2c text-center mr-3 rounded text-white align-items-center justify-content-center ' + bgIcon}>
					<FA name={icon} fixWidth={true} size="lg" />
				</div>
				<div className="flex-grow-1">单位</div>
				<div>
				</div>
			</div>
			<List className="my-3" 
				items={this.controller.myMembersPager}
				item={{render:this.renderMemberItem, onClick:this.onMemberItem}}
				none="无"
			/>
		</>;
	}

	private renderMemberItem = (memberItem:MemberItem, index:number) => {
		let {member, count} = memberItem;
		return <div className="d-flex px-3 py-2">
			{this.renderUser(member, 'w-2c h-2c mr-3', 'flex-grow-1')}
			<div>
				{count>0 && <Muted>{count}群</Muted>}
			</div>
		</div>
	}

	private onMemberItem = (userId:number) => {
		this.controller.showMemberDetail(userId);
	}
}
