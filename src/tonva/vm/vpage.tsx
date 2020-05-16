import * as React from 'react';
import { Page, Scroller, TabsProps } from "../components";
import { View } from "./view";
import { Controller } from "./controller";

export abstract class VPage<C extends Controller> extends View<C> {
    open(param?:any):Promise<void> {
		this.init(param);
		this.openPageElement(this.renderPage());
		return;
	}

	render(param?:any):JSX.Element {
		this.init(param);
		//return this.content();
		return this.renderPage();
	}

	init(param?:any):void {return;}

	header():string|boolean|JSX.Element {return null;}
	right():JSX.Element {return null;}
	content():JSX.Element {return null;}
	footer():JSX.Element {return null;}
	logout(): boolean | (()=>Promise<void>) {return false;}
	protected renderPage():JSX.Element {
		let header = this.header();
		if (!header) header = false;
		return <Page
			header={header} right={this.right()} footer={this.footer()}
			onScroll={(e:any)=>this.onPageScroll(e)}
			onScrollTop={(scroller: Scroller) => this.onPageScrollTop(scroller)}
			onScrollBottom={(scroller: Scroller) => this.onPageScrollBottom(scroller)}
			back={this.back}
			headerClassName={this.headerClassName}
			bgClassName={this.bgClassName}
			afterBack={()=>this.afterBack()}
			tabsProps={this.tabsProps}
			logout={this.logout()}
		>
			{this.content()}
		</Page>;
	}

	protected onPageScroll(e:any) {}
	protected onPageScrollTop(scroller: Scroller): void {}
	protected onPageScrollBottom(scroller: Scroller): void {}
	protected afterBack():void {}
	protected get back(): 'close' | 'back' | 'none' {return 'back'}
	protected get headerClassName(): string {return null;}
	protected get bgClassName(): string {return null;}
	protected get tabsProps(): TabsProps {return null;}
}
