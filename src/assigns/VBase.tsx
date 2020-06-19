import React from "react";
import { CAssigns } from "./CAssigns";
import { VPage, useUser, Tuid, BoxId } from "tonva";
import { Task, Assign } from "models";

export abstract class VBase<T extends CAssigns> extends VPage<T> {
	protected get assign(): Assign {return this.controller.assign;};

	init(param?: any) {
		if (this.assign) {
			useUser(this.assign.owner);
		}
	}

	private divTop:HTMLElement;
	protected scrollToTop() {
		setTimeout(() => {
			this.divTop?.scrollIntoView();
		}, 100);
	}
	private refTop = (el:HTMLElement) => {
		if (!el) return;
		this.divTop=el.parentElement.previousElementSibling as HTMLElement;
	}
	protected renderDivTop() {
		return <div ref={this.refTop} style={{height:'0.01rem'}}></div>
	}

	private divBottom:HTMLElement;
	protected scrollToBottom() {
		setTimeout(() => {
			this.divBottom?.scrollIntoView();
		}, 100);
	}

	protected renderDivBottom() {
		return <div ref={v=>this.divBottom=v} style={{height:'0.01rem'}}></div>
	}

	protected isMe(user:number|BoxId):boolean {
		return (Tuid.equ(user, this.controller.user.id))
	};
}
