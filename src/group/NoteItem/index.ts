import { Note } from "../../models";
import { EnumNoteType, EnumTaskStep, EnumTaskState } from "../../tapp";
import { NoteText } from "./NoteText";
import { NoteAssign } from "./NoteAssign";
import { NoteTaskTodo } from "./NoteTaskTodo";
import { NoteItem } from "./NoteItem";
import { CGroup } from "../CGroup";

export * from "./NoteItem";
export * from './NoteAssign';
export * from './NoteTaskTodo';

export function dataToNoteItem(cGroup: CGroup, note:Note, queryResults:{[name:string]:any[]}):NoteItem {
	switch (note.type) {
		default: 
			debugger;
			throw new Error('unknow note type');
		case EnumNoteType.Text:
			return buildNoteText(cGroup, note, queryResults);
		case EnumNoteType.Assign:
			return buildNoteAssign(cGroup, note, queryResults);
		case EnumNoteType.Task:
			return buildNoteTaskTodo(cGroup, note, queryResults);
	}
}

export function createNoteText(cGroup: CGroup, owner:any, content:string):NoteText {
	let ret:NoteText = new NoteText(cGroup);
	ret.owner = owner;
	ret.content = content;
	ret.$create = new Date();
	return ret;
}

export function createNoteAssign(cGroup: CGroup, owner:any, assignId:number):NoteAssign {
	let noteAssign:NoteAssign = new NoteAssign(cGroup);
	noteAssign.owner = owner;
	noteAssign.$create = new Date();
	noteAssign.assignId = assignId;
	return noteAssign;
}

export function createNoteTaskTodo(cGroup: CGroup):NoteTaskTodo {
	let taskTodo:NoteTaskTodo = new NoteTaskTodo(cGroup);
	return taskTodo;
}


function buildNoteText(cGroup: CGroup, note: Note, results:{[name:string]:any[]}):NoteItem {
	let ret:NoteText = new NoteText(cGroup);
	let {id, owner, content} = note;
	ret.id = id;
	ret.owner = owner;
	ret.$create = note.$create;
	ret.content = content;
	return ret;
}

function buildNoteAssign(cGroup: CGroup, note:Note, results:{[name:string]:any[]}):NoteItem {
	let noteAssign: NoteAssign = new NoteAssign(cGroup);
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

function buildNoteTaskTodo(cGroup: CGroup, note:Note, results:{[name:string]:any[]}):NoteItem {
	let ret:NoteTaskTodo = new NoteTaskTodo(cGroup);
	let {id, owner, $create, content, obj} = note;
	ret.id = id;
	ret.owner = owner;
	ret.$create = $create;
	if (content) {
		let parts = content.split('|');
		ret.step = Number(parts[0]) as EnumTaskStep;
		ret.state = Number(parts[1]) as EnumTaskState;
	}

	let {tasks} = results;
	let annItem = tasks.find(v => v.taskId === obj);
	if (annItem !== undefined) {
		let {taskId, caption, discription} = annItem;
		ret.taskId = taskId;
		ret.caption = caption;
		ret.discription = discription;
		//ret.time = time;
		ret.x = note.x;
	}
	return ret;
}
