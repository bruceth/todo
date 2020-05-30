import { EnumNoteType, EnumTaskState } from '../tapp';

export interface Group {
	id: number;
	count: number;
	name: string;
	discription: string;
	owner: number;
}

export interface Note {
	id: number;
	group: number;
	content: string;
	type?: EnumNoteType;
	obj?: number; // | NoteObj;
	owner: number;
	x: number;
	$create: Date;
}

export interface Assign {
	id: number;
	caption: string;
	discription: string;
	owner: number;
	open: number; 		// 0:开放 1: 一个人执行 2:指定人
	point: number;
	$create: Date;
	$update: Date;
	items: AssignItem[];
	tasks?: AssignTask[];
}

export interface AssignItem {
	id: number;
	discription: string;
}

export interface AssignTask {
	id: number; // Task ID ASC,
	assign: number|any; // ID Assign,
	worker: number; // ID,
	$create: Date; // TIMESTAMP,
	state: EnumTaskState;
	date: Date;
	stepDate: Date;
	stepComment: string;
}

export interface Task {
	id: number;
	assign: Assign;
	caption: string;
	discription: string;
	owner: number;
	$create: Date;
	$update: Date;
	state: EnumTaskState;
	todos: Todo[];
	meTask: MeTask[];
	flow: TaskFlow[];
}

export interface Todo {
	id: number;
	task: number;
	assignItem: number;
	discription: string;
	x: number;
	$update: Date;
	done?: 0|1;
	doneMemo?: string;
	check?: 0|1;
	checkMemo?: string;
}

export interface MeTask {
	me: number,
	act: number,			// EnumTaskStep
}

export interface TaskFlow {
	date: Date,
	user: number,
	state: number,			// 0:初建，10:领办，20:已办，30:拒办，40:取消
	comment: string,
}
