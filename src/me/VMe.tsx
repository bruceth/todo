import React from 'react';
import { VPage, UserView, User } from 'tonva';
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
		let renderUser = (user:User) => {
			return <>{user.name}</>;
		}
		return <div className="p-3">
			<div className="mb-3">
				<UserView user={this.controller.user.id} render={renderUser} />
			</div>
			<div className="small text-muted">
				正在建设中...
			</div>
		</div>;
	}
}
