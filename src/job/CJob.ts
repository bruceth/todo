import { CUqBase } from "tonvaApp";
import { VJob } from "./VJob";
import { QueryPager } from "tonva";
import { observable } from "mobx";
import { CAct } from '../act/CAct';
import { stateDefs } from "tools";

export class CJob extends CUqBase {
	@observable myTodosList: any[];
	myArchiveTodosPager: QueryPager<any>;

    protected async internalStart() {		
	}

	tab = () => this.renderView(VJob);

	load = async () => {
		let ret = await this.uqs.performance.GetMyTodos.query(undefined);
		this.myTodosList = ret.ret;
	}

	showTodo = async (item: any) => {
		let cAct = this.newC(CAct);
		await cAct.start(item);
		let toState = await cAct.showDialog();
		if (toState !== stateDefs.todo && toState !== stateDefs.doing) {
			let index = this.myTodosList.findIndex(v => v === item);
			if (index>=0) this.myTodosList.splice(index, 1);
		}
	}
}
