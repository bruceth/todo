import { Tuid, Map, Query, Action, Sheet, Tag } from "tonva";

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
	TodoTemplet: Tuid;
	Task: Tuid;
	SaveNote: Action;
	SaveTodo: Action;
	TaskTodo: Action;
	TaskAct: Action;
	TodoAct: Action;
	RemoveTask: Action;

	GetTodo: Query;
	GetMyTodos: Query;
	GetMyArchiveTodos: Query;
	GetUserTodos: Query;

	TestExpression: Action;
	test1: Tag;
	test2: Tag;
}

export interface UQs {
    performance: Performance
}
