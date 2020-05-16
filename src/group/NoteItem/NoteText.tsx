import React from 'react';
import classNames from 'classnames';
import { NoteItem } from "./NoteItem";
import { Tuid } from 'tonva';

export class NoteText extends NoteItem {
	content: string;
	renderAsNote(onClick:()=>void):JSX.Element {
		let isMe = (Tuid.equ(this.owner, this.controller.user.id));
		let cnDiv = classNames('p-3 rounded', {"bg-white": !isMe});
		let bgStyle:{[prop:string]:string} = {maxWidth:'75%'};
		if (isMe === true) bgStyle['backgroundColor'] = '#8f8';
		return <div className={cnDiv} style={bgStyle}>{this.content}</div>;
	}

	renderInView():JSX.Element {
		return this.renderAsNote(undefined);
	}
}
