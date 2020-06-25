import React from 'react';
import { VPage } from 'tonva';
import { CMe } from './CMe';

export class VMe extends VPage<CMe> {
	init(param?:any) {
		// useUser(10);
	}
	logout(): boolean | (()=>Promise<void>) {return true;}
	render(param?:any):JSX.Element {
		this.init(param);
		return this.renderPage();
	}

	header() {return  '我的'}
	content() {
		return <div className="p-3">
			<div className="mb-3">
				{this.renderMe()}
			</div>
			<div className="small text-muted">
				正在建设中...
			</div>
		</div>;
	}
}
