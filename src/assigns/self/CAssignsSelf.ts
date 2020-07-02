import { CAssigns } from "../CAssigns";
import { VListForSelf } from "./VListForSelf";
import { VAssignDraftSelf, VAssignEndSelf } from "./VAssignSelf";

export class CAssignsSelf extends CAssigns {
	get caption():string {return '我的待办';}
	get groupId(): number {return 0;}
	protected openVList():void {this.openVPage(VListForSelf);}
	protected openVAssign(): void {
		this.openVPage(this.assign.end === 1? VAssignEndSelf : VAssignDraftSelf);
	}

	newAssign = async (caption:string) => {
		let data = {caption};
		let {CreateAndSendAssign} = this.performance;
		let result = await CreateAndSendAssign.submit(data);
		let res = result;
		let {id} = res;
		let assign = this.performance.Assign.boxId(id);
		this.assignListItems.unshift({assign});
	}

	saveTodoItem = async (todoContent: string):Promise<any> => {
		let id:number = undefined;
		let assignItem: number = undefined;
		let {tasks} = this.assign;
		let my = tasks.find(v => this.isMe(v.worker));

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

