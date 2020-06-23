import React from "react";
import { VSendBase } from "./VSendBase";
import { UserView, User, Image } from "tonva";
import { observer } from "mobx-react";
import { computed } from "mobx";

export class VSelectToList extends VSendBase {

	@computed protected get nextDisabled(): boolean {
		let {members} = this.controller;
		let enabled = false;
		for (let i in members) {
			if (members[i] === true) {
				enabled = true;
				break;
			}
		}
		return !enabled;
	}

	renderMiddlePart() {
		const cn = 'mr-5 my-2 d-flex align-items-center w-min-12c';
		return React.createElement(observer(()=>{
			let items = this.controller.membersPager.items;
			let {members, user:me} = this.controller;
			let meId = me.id;
			let renderUser = (user:User) => {
				let {id, name, nick, icon} = user;
				let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
					members[id] = evt.target.checked;
				};
				return <label className={cn}>
					<input type="checkbox" className="mx-2" value={id} 
						defaultChecked={members[id]===true}
						onChange={onChange} />
					<Image src={icon} className="w-1c h-1c mr-1" />
					<div>{nick || name}</div>
				</label>;
			}
			return <div className="form-group">
				<label className="">执行人</label>
				<div className="px-3 py-2 bg-white border rounded">
					<div className="d-flex flex-wrap">
						{items.map((v, index) => {
							let {member} = v;
							if (this.isMe(member) === true) return undefined;
							return <UserView key={member} user={member} render={renderUser} />
						})}
					</div>
					<label className={cn}>
						<input type="checkbox" className="mx-2" value={meId} 
							defaultChecked={members[meId]===true}
							onChange={(evt: React.ChangeEvent<HTMLInputElement>)=>members[meId]=evt.target.checked} />
						<div className="text-info">我自己</div>
					</label>
				</div>
			</div>;
		}));
	}
}
