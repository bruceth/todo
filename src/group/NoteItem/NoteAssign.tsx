import React from 'react';
import { NoteItem } from "./NoteItem";
import { stateIcon } from 'tools';
import { EasyTime } from 'tonva';

export class NoteAssign extends NoteItem {
	assignId: number;
	caption: string;
	discription: string;
	time: Date;
	x: number = 0;

	renderAsNote():JSX.Element {
		if (this.x === 1) {
			// removed
			return <div className="w-100 d-flex justify-content-center">
				<div className="bg-light py-1 px-3 small text-muted">撤销了 <del>{this.discription}</del></div>
			</div>
		}
		return this.renderInternal();
	}
	renderInView():JSX.Element {
		return this.renderInternal();
	}

	private onClick = () => {
		this.cGroup.showAssign(this);
	}

	private renderInternal():JSX.Element {
		let cn = 'bg-info rounded border border-info w-75 cursor-pointer';
		return <div className={cn}
			onClick={this.onClick}>
			<div className="d-flex align-items-center ">
				<div className="d-flex align-items-center justify-content-center text-danger w-3c h-3c 
					bg-white border-info rounded-left">
					{stateIcon(undefined)}
				</div>
				<div className="flex-fill px-3 py-2 text-white">
					<div><b>{this.caption}</b></div>
					<div><span className="">{this.discription}</span></div>
				</div>
				<div className="small px-3 py-1 text-light">
					<EasyTime date={this.$create} />
				</div>
			</div>
		</div>;
	}
}
