import * as React from 'react';
import { stateName, stateIcon } from 'tools';
import { FA, EasyTime } from 'tonva';
import { observable } from 'mobx';

export interface Note {
	id: number;
	group: number;
	content: string;
	type?: number;
	obj?: number | NoteObj;
	owner: number;
	x: number;
	$create: Date;
}

export abstract class NoteObj {
	type: number;
	obj: number;

	abstract renderAsNote(onClick:()=>void):JSX.Element;
	abstract renderInView():JSX.Element;
}

export interface Task {
	id: number;
	caption: string;
	discription: string;
	todos: Todo[];
	time: Date;
	owner: number;
}

export interface Todo {
	id: number;
	task: number;
	content: string;
	worker: number;
	state: number;
}

export class NoteTask extends NoteObj {
	id: number;
	templet: number;
	discription: string;
	time: Date;
	owner: number;
	x: number;
	@observable todo: number | Todo;
	//state: number;
	renderAsNote(onClick:()=>void):JSX.Element {
		if (this.x === 1) {
			// removed
			return <div className="w-100 d-flex justify-content-center">
				<div className="bg-light py-1 px-3 small text-muted">撤销了 <del>{this.discription}</del></div>
			</div>
		}
		let style:React.CSSProperties;
		if ((this.todo as Todo)?.state) style = {
			opacity: 0.4
		};
		return this.renderInternal(style, onClick);
	}
	renderInView():JSX.Element {
		return this.renderInternal(undefined, undefined);
	}

	private renderInternal(style:React.CSSProperties, onClick:()=>void):JSX.Element {
		let cn = 'bg-info rounded w-75 border border-info ';
		if (onClick) cn += 'cursor-pointer';
		let state = (this.todo as Todo)?.state;
		return <div className={cn}
			style={style}
			onClick={onClick}>
			<div className="d-flex align-items-center ">
				<div className="d-flex align-items-center justify-content-center text-danger w-3c h-3c 
					bg-white border-info rounded-left">
					{stateIcon(state)}
				</div>
				<div className="flex-fill px-3 py-2">
					<span className="text-white">{this.discription}</span>
				</div>
				<div className="small px-3 py-1 text-light">
					<EasyTime date={this.time} />
				</div>
			</div>
		</div>;
	}
}

export function buildNote(note: Note, results:{[name:string]:any[]}) {
	let {type} = note;
	switch (type) {
		case 1:
			buildNoteTask(note, results);

			break;
	}
}

function buildNoteTask(note:Note, results:{[name:string]:any[]}):void {
	let arrTask = results.rettask;
	let annItem = arrTask.find(v => v.id === note.id);
	if (annItem !== undefined) {
		let task = new NoteTask();
		let {taskId, discription, state, todo:todoId, worker, time} = annItem;
		task.type = 1;
		task.id = taskId;
		task.discription = discription;
		task.time = time;
		task.todo = {
			id: todoId,
			task: taskId,
			worker,
			state,
		} as Todo;
		task.x = note.x;
		note.obj = task;
	}

}
