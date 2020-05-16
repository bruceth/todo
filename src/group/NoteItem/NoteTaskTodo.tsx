import React from 'react';
import { NoteItem } from "./NoteItem";

export class NoteTaskTodo extends NoteItem {
	taskId: number;
	caption: string;
	discription: string;
	time: Date;
	owner: number;
	x: number;
	renderAsNote(onClick:()=>void):JSX.Element {
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

	private renderInternal():JSX.Element {
		return <div className="border rounded px-3 py-1 text-muted bg-light">
			领办 <span className="text-dark">{this.caption}</span>
			&nbsp;
			<span className="">{this.discription}</span>
		</div>;
	}
}
