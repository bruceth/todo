import React from "react";
import { CAssigns } from "./CAssigns";
import { VPage } from "tonva";

export abstract class VBase<T extends CAssigns> extends VPage<T> {
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
}
