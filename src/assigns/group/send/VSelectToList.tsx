import React from "react";
import { VSendBase } from "./VSendBase";
import { UserView, User, Image } from "tonva";
import { CSend } from "./CSend";

export class VSelectToList extends VSendBase {
    constructor(controller: CSend) {
		super(controller);
		this.nextDisabled = true;
    }
	renderMiddlePart() {
		let items = this.controller.membersPager.items;
		let renderUser = (user:User) => {
			let {id, name, nick, icon} = user;
			let {members} = this.controller;
			let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
				members[id] = evt.target.checked;
				let enabled = false;
				for (let i in members) {
					if (members[i] === true) {
						enabled = true;
						break;
					}
				}
				this.nextDisabled = !enabled;
			};
			return <label className="mr-5 my-2 d-flex align-items-center w-min-12c">
				<input type="checkbox" className="mx-2" value={id} 
					defaultChecked={members[id]===true}
					onChange={onChange} />
				<Image src={icon} className="w-1c h-1c mr-1" />
				<div>{nick || name}</div>
			</label>;
		}
		return <div className="d-flex px-3 py-2 bg-white border rounded flex-wrap">
			{items.map((v, index) => {
				return <UserView user={v.member} render={renderUser} />
			})}
		</div>
	}
}
