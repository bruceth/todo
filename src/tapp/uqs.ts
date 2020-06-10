// eslint-disable-next-line
import { Tuid, Map, Query, Action, Sheet, Tag } from "tonva";

export enum EnumNoteType {Text=0, Assign=10, Task=20};
export enum EnumTaskState {
	start=0, 
	todo=20, doing=21, done=22, 
	pass=40, fail=41,
	rated=60, 
	archive=-20,
	cancel=-40
};
export enum EnumTaskStep {todo=20, done=22, check=40, rate=60};

const stateTexts:{[key in EnumTaskState]?:{text:string;act:string;pending:boolean}} = {
	[EnumTaskState.start]: {text:undefined, act:undefined, pending:true},
	[EnumTaskState.todo]: {text:'待办', act:'领办', pending:true},		// todo=20
	[EnumTaskState.doing]: {text:'待办', act:'领办', pending:true},		// doing=21
	[EnumTaskState.done]: {text:'待查验', act:'完成', pending:false}, 	// done=22, 
	[EnumTaskState.pass]: {text:'待评价', act:'验收', pending:false}, 	// pass=40, 
	[EnumTaskState.fail]: {text:'待办', act:'拒签', pending:false},		// fail=41,
	[EnumTaskState.rated]: {text:'已评价', act:'评价', pending:false}, 	// rated=60, 
	[EnumTaskState.archive]: {text:'已归档', act:'评价', pending:false},		// archive=-20,
	[EnumTaskState.cancel]: {text:'已取消', act:'归档', pending:false},		// cancel=-40
}

export function stateText(state:EnumTaskState):{text:string; act:string; pending:boolean} {
	return stateTexts[state];
	/*
	let text:string, act:string;
	switch (state) {
		default:
			text = '未知'; act = '未知'; break;
		case EnumTaskState.todo:
			text = '待办'; act = '领办'; break;
		case EnumTaskState.done:
			text = '待查验'; act = '完成'; break;
		case EnumTaskState.pass:
			text = '待评价'; act = '验收'; break;
		case EnumTaskState.fail:
			text = '待办'; act = '拒签'; break;
		case EnumTaskState.rated:
			text = '已评价'; act = '评价'; break;
		case EnumTaskState.archive:
			text = '已归档'; act = '归档'; break;
		}
	return {text, act};
	*/
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
	
	NewAssign: Action;
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
	TestText: Action;

	$Poked: Query;
	MyTickTodo: Query;
	GetMyAssigns: Query;
	GetAssign: Query;
	GetTodo: Query;
	GetMyArchiveTodos: Query;
	GetUserTodos: Query;
	GetTask: Query;
	GetMyTasks: Query;
	GetMyTaskArchive: Query;
	GetMyMembers: Query;

	TestExpression: Action;
	test1: Tag;
	test2: Tag;
}

export interface UQs {
    performance: Performance
}
