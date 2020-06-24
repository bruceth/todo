// eslint-disable-next-line
import { Tuid, Map, Query, Action, Sheet, Tag } from "tonva";

export enum EnumNoteType {Text=0, Assign=10, Task=20};
export enum EnumTaskState {
	start=0, 
	todo=20, doing=21, done=22, 
	pass=40, fail=41,
	rated=60, 
	cancel=-40
};
export enum EnumTaskAct {todo=20, done=22, check=40, rate=60};
export interface StateText {
	me:string; 
	other?:string; 
	act:string;
	pending:boolean
}

const stateTexts:{[key in EnumTaskState]:StateText} = {
	[EnumTaskState.start]: {me:'收到', other:'收到', act:undefined, pending:true},
	[EnumTaskState.todo]: {me:'待办', act:'领办', pending:true},		// todo=20
	[EnumTaskState.doing]: {me:'在办', act:'领办', pending:true},		// doing=21
	[EnumTaskState.done]: {me:'已完成', act:'完成', pending:false}, 	// done=22, 
	[EnumTaskState.pass]: {me:'已验收', act:'验收', pending:false}, 	// pass=40, 
	[EnumTaskState.fail]: {me:'已拒签', act:'拒签', pending:false},		// fail=41,
	[EnumTaskState.rated]: {me:'已评价', act:'评价', pending:false}, 	// rated=60, 
	[EnumTaskState.cancel]: {me:'已取消', act:'归档', pending:false},		// cancel=-40
}

export function stateText(state:EnumTaskState):StateText {
	return stateTexts[state];
}

export function actText(act:EnumTaskAct): string {
	switch (act) {
		default: return '';
		case EnumTaskAct.todo: return '办理';
		case EnumTaskAct.done: return '完成';
		case EnumTaskAct.check: return '查验';
		case EnumTaskAct.rate: return '评价';
	}
}

export const TaskAct = {
	done: '办理',
	check: '查验',
	rate: '评价',
}

export interface Performance {
	Group: Tuid;
	AddGroupMember: Action;
	RemoveGroupMember: Action;
	GetMyGroups: Query;
	SaveGroup: Action;
	SaveGroupProp: Action;
	GetGroupNotes: Query;
	GetGroupMembers: Query;

	Todo: Tuid;
	Task: Tuid;
	Assign: Tuid;
	AssignItem: Tuid;
	
	CreateAssign: Action;
	NewAssign: Action;
	DoneAssign: Action;
	SendAssign: Action;
	DoneTask: Action;
	PassTask: Action;
	FailTask: Action;
	RateTask: Action;

	TakeAssign: Action;
	TaskDone: Action;
	TaskPass: Action;
	TaskFail: Action;
	TaskRate: Action;
	PushNote: Action;
	SaveTodo: Action;
	TaskTodo: Action;
	TaskAct: Action;
	RemoveTask: Action;
	PublishAssign: Action;
	SaveAssignProject: Action;
	TestText: Action;

	$Poked: Query;
	GetAssigns: Query;
	MyTickTodo: Query;
	GetMyAssigns: Query;
	GetAssign: Query;
	GetTodo: Query;
	GetMyArchiveTodos: Query;
	GetUserTodos: Query;
	GetTask: Query;
	GetTaskFlow: Query;
	GetMyTasks: Query;
	//GetMyTaskArchive: Query;
	GetMyMembers: Query;

	Project: Tuid;
	SaveProject: Action;
	GetMyProjects: Query;

	TestExpression: Action;
	test1: Tag;
	test2: Tag;
}

export interface UQs {
    performance: Performance
}
