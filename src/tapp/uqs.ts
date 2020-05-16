// eslint-disable-next-line
import { Tuid, Map, Query, Action, Sheet, Tag } from "tonva";

export enum EnumNoteType {Text=0, Assign=10, TaskTodo=20};
export enum EnumTaskState {
	start=0, 
	todo=20, doing=21, done=22, 
	check=40, checking=41, checked=42, 
	rate=61, rating=62, rated=63,
	archive=-20,
	cancel=-40
};
//export enum EnumTaskStep {author=0, do=20, check=40, rate=60, archive=-20, cancel=-40};

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
	
	TaskAssign: Action;
	TaskDone: Action;
	PushNote: Action;
	SaveTodo: Action;
	TaskTodo: Action;
	TaskAct: Action;
	RemoveTask: Action;
	PublishAssign: Action;
	TodoTask: Action;
	TestText: Action;

	GetMyAssigns: Query;
	GetAssign: Query;
	GetTodo: Query;
	GetMyArchiveTodos: Query;
	GetUserTodos: Query;
	GetTask: Query;
	GetMyTasks: Query;

	TestExpression: Action;
	test1: Tag;
	test2: Tag;
}

export interface UQs {
    performance: Performance
}
