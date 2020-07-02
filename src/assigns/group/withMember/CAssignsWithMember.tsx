import { AssignTask } from "models";
import { VListForGroup } from "./VListForGroup";
import { CSend } from "./send";
import { VCheck, VRate } from "assigns/task";
import { CAssignsForGroup } from "../CAssignsForGroup";
import { VAssignDraftWithMember, VAssignEndWithMember, VAssignDoingWithMember } from "../VAssignWithMember";
import { EnumTaskState } from "tapp";

export interface TasksToCategory {
	my:AssignTask,
	myCanEdit: boolean,
	checks:AssignTask[], 
	rates:AssignTask[], 

	starts: AssignTask[];

	dones: AssignTask[];
	passes: AssignTask[];
	fails: AssignTask[];
	rateds: AssignTask[];
	cancels: AssignTask[];
	invalids: AssignTask[];
}

export class CAssignsWithMember extends CAssignsForGroup {
	tasksToCategory: TasksToCategory;

	protected openVList():void {this.openVPage(VListForGroup);}
	protected openVAssign(): void {
		let {end, tasks} = this.assign;
		let vp;
		if (end === 1) vp = VAssignEndWithMember;		
		else if (tasks.length === 0) vp = VAssignDraftWithMember;
		else vp = VAssignDoingWithMember;
		this.openVPage(vp);
	}

	showAssignTo = async () => {
		let cSend = this.newSub(CSend);
		cSend.start();
	}

	showCheck = async (task: AssignTask) => {
		this.openVPage(VCheck, task);
	}

	showRate = async (task: AssignTask) => {
		this.openVPage(VRate, task);
	}

	protected onAssignLoaded(): void {
		let {tasks, checker, rater} = this.assign;
		let my: AssignTask;
		let myCanEdit: boolean = false;
		let checks: AssignTask[] = [];
		let rates: AssignTask[] = [];

		let starts: AssignTask[] = [];

		let dones: AssignTask[] = [];
		let passes: AssignTask[] = [];
		let fails: AssignTask[] = [];
		let rateds: AssignTask[] = [];
		let cancels: AssignTask[] = [];
		let invalids: AssignTask[] = [];

		let isChecker = this.isMe(checker);
		let isRater = this.isMe(rater);

		for (let task of tasks) {
			let {
				//id, //: number; // Task ID ASC,
				//assign, //: number|any; // ID Assign,
				worker, //: number; // ID,
				//$create, //: Date; // TIMESTAMP,
				state, //: EnumTaskState;
				//date, //: Date;
				//stepDate, //: Date;
				//stepComment, //: string;
			} = task;
			if (this.isMe(worker) === true) {
				my = task;
				switch (state) {
					case EnumTaskState.start:
					case EnumTaskState.todo:
					case EnumTaskState.doing: myCanEdit = true;
				}
			}
			else {
				switch (state) {
					case EnumTaskState.start: starts.push(task);  break;
					case EnumTaskState.done:
						(isChecker === true? checks : dones).push(task);
						break;
					case EnumTaskState.pass:
						(isRater === true? rates : passes).push(task);
						break;
					case EnumTaskState.fail: fails.push(task); break;
					case EnumTaskState.rated: rateds.push(task); break;
					case EnumTaskState.cancel: cancels.push(task); break;
					default:
						invalids.push(task);
						break;
				}
			}
		}

		this.tasksToCategory = {
			my,
			myCanEdit,
			checks,
			rates,
			starts,
			dones,
			passes,
			fails,
			rateds,
			cancels,
			invalids,
		};
	}

	saveTodoItem = async (todoContent: string):Promise<any> => {
		let {my} = this.tasksToCategory;
		if (!my) alert('something wrong');
		let id:number = undefined;
		let assignItem: number = undefined;
		let todo = {
			id: id, 
			task: my.id,
			assignItem,
			discription: todoContent,
			x: 0,
			$update: new Date()
		};
		let ret = await this.uqs.performance.Todo.save(undefined, todo);
		todo.id = ret.id;
		my.todos.push(todo);
		return todo;
	}
}
