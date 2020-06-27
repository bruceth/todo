import React from "react";
import { VAssignDraft, VAssignEnd, vStopFlag } from "../VAssign";
import { CAssignsSelf } from "./CAssignsSelf";
import { AssignItem } from "models";

export class VAssignDraftSelf extends VAssignDraft<CAssignsSelf> {
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
}

export class VAssignEndSelf extends VAssignEnd<CAssignsSelf> {
	protected get selfDoneCaption():string {return '完成'}

	renderContent() {
		let {tasks} = this.assign;
		let my = tasks[0];
		return <>
			{super.renderContent()}
			<div className="mt-3 px-3 py-2 bg-white">
				{this.renderTaskItem(my)}
				<span className="mx-3">{vStopFlag}</span>
			</div>
		</>;
	}
}
