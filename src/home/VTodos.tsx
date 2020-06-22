import { CHome } from "./CHome";
import { View } from "tonva";
import React from 'react';
import { List, EasyTime, Muted, tv, FA, VPage, User, Image, UserView } from 'tonva';
import { Assign, Doing } from 'models';
import { stateText } from 'tapp';
//import { CReport, Doing } from './CReport';
import { observer } from 'mobx-react';

export class VTodos extends View<CHome> {
	render() {
		return this.content();
	}
	content() {
		let page = observer(() => {
			let none = <div className="px-3 py-2 text-muted small border-top">[无]</div>;
			return <List className="bg-transparent" items={this.controller.myDoingsPager}
					item={{render: this.renderDoing, onClick: this.onClickDoing, key: this.keyDoing, className:"bg-transparent"}}
					none={none}
					/>
		});
		return React.createElement(page);
	}

	private keyDoing = (doing: Doing) => {
		return doing.task;
	}

	private onClickDoing = (doing: Doing) => {
		this.controller.cApp.showTask(doing.task);
	}

	private renderState(doing:Doing):JSX.Element {
		let {state, date} = doing;
		let pointer = <FA className="text-danger mr-1" name="chevron-circle-right" />;
		let {me, act} = stateText(state);
		return <>{pointer} <small>{me}</small> &nbsp; <Muted>{act}于<EasyTime date={date} /></Muted></>;
	}

	private renderDoing = (doing:Doing, index: number) => {
		let {assign, worker, $create} = doing;
		let renderIcon = (user:User) => {
			let {icon} = user;
			return <Image className="w-2c h-2c mt-1" src={icon} /> 
		};
		let renderNick = (user:User) => {
			let {name, nick} = user;
			return <small>{nick || name}</small>
		};
		return tv(assign, (values: Assign) => {
			let {caption, discription} = values;
			return <div className="my-1 bg-white">
				<div className="px-3 py-2">
					<UserView user={worker} render={renderIcon} />
				</div>
				<div className="flex-fill">
					<div className="d-flex pt-1 pb-2">
						<div className="flex-fill pl-2">
							<UserView user={worker} render={renderNick} />
							<div><b>{caption}</b> &nbsp; <Muted>{discription}</Muted></div>
						</div>
						<div className="pr-2"><Muted><EasyTime date={$create} /></Muted></div>
					</div>
					<div className="text-primary pl-2 py-1 border-top">{this.renderState(doing)}</div>
				</div>
			</div>;
		});
	}
}
