import React from "react";
import { VAssignDraft, VAssignEnd } from "../../VAssign";
import { CAssignsNoMember } from "./CAssignsNoMember";
import { AssignItem } from "models";

export class VAssignDraftNoMember extends VAssignDraft<CAssignsNoMember> {
	protected get selfDoneCaption():string {return '完成'}

	protected renderAssignItem(item:AssignItem) {
		let {id, discription} = item;
		let onCheckChanged = (isChecked:boolean):Promise<void> => {
			//alert(isChecked);
			return;
		}
		return <div className="pl-4 bg-white">
			{this.renderTodoWithCheck(id, discription, onCheckChanged, false)}
		</div>;
	}

	protected renderContent() {
		return super.renderContent();
	}
}

export class VAssignEndNoMember extends VAssignEnd<CAssignsNoMember> {
	protected get selfDoneCaption():string {return '完成'}
}
