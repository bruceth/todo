import { Controller } from "tonva";
import { Note } from "../../models";
import { EnumNoteType } from "../../tapp";
import { NoteText } from "./NoteText";
import { NoteAssign } from "./NoteAssign";
import { NoteTaskTodo } from "./NoteTaskTodo";
import { NoteItem } from "./NoteItem";

export * from "./NoteItem";
export * from './NoteAssign';
export * from './NoteTaskTodo';

export function dataToNoteItem(controller: Controller, note:Note, queryResults:{[name:string]:any[]}):NoteItem {
	switch (note.type) {
		default: 
			debugger;
			throw new Error('unknow note type');
		case EnumNoteType.Text:
			return buildNoteText(controller, note, queryResults);
		case EnumNoteType.Assign:
			return buildNoteAssign(controller, note, queryResults);
		case EnumNoteType.TaskTodo:
			return buildNoteTaskTodo(controller, note, queryResults);
	}
}

export function createNoteText(controller:Controller, owner:any, content:string):NoteText {
	let ret:NoteText = new NoteText(controller);
	ret.owner = owner;
	ret.content = content;
	ret.$create = new Date();
	return ret;
}

export function createNoteAssign(controller:Controller, owner:any, assignId:number):NoteAssign {
	let note:NoteAssign = new NoteAssign(controller);
	note.owner = owner;
	note.$create = new Date();
	note.assignId = assignId;
	return note;
}

export function createNoteTaskTodo(controller:Controller):NoteTaskTodo {
	let taskTodo:NoteTaskTodo = new NoteTaskTodo(controller);
	return taskTodo;
}


function buildNoteText(controller: Controller, note: Note, results:{[name:string]:any[]}):NoteItem {
	let ret:NoteText = new NoteText(controller);
	let {id, owner, content} = note;
	ret.id = id;
	ret.owner = owner;
	ret.$create = note.$create;
	ret.content = content;
	return ret;
}

function buildNoteAssign(controller: Controller, note:Note, results:{[name:string]:any[]}):NoteItem {
	let noteAssign: NoteAssign = new NoteAssign(controller);
	let {id, owner, $create, obj} = note;
	noteAssign.id = id;
	noteAssign.owner = owner;
	noteAssign.$create = $create;
	let {assigns} = results;
	let assign = assigns.find(v => v.assignId === obj);
	if (assign !== undefined) {
		let {assignId, caption, discription} = assign;
		noteAssign.assignId = assignId;
		noteAssign.caption = caption;
		noteAssign.discription = discription;
		noteAssign.x = note.x;
	}
	return noteAssign;
}

function buildNoteTaskTodo(controller: Controller, note:Note, results:{[name:string]:any[]}):NoteItem {
	let ret:NoteTaskTodo = new NoteTaskTodo(controller);
	ret.id = note.id;
	ret.owner = note.owner;
	ret.$create = note.$create;
	let arrTask = results.rettask;
	let annItem = arrTask.find(v => v.taskId === note.obj);
	if (annItem !== undefined) {
		let {taskId, caption, discription, time} = annItem;
		ret.taskId = taskId;
		ret.caption = caption;
		ret.discription = discription;
		ret.time = time;
		ret.x = note.x;
	}
	return ret;
}
