import { CUqBase } from "../tapp";
import { VAct } from "./VAct";

export class CAct extends CUqBase {
	//private toState: number;

	todo: any;
	acts: any[];
	assess: any;

    protected async internalStart(todoId: any) {
		let ret = await this.uqs.performance.GetTodo.query({todoId});
		this.todo = ret.rettodo[0];
		this.acts = ret.acts;
		this.assess = ret.assess[0];
		//this.openVPage(VAct);
	}

	todoAct = async (toState:number) => {
		//await this.uqs.performance.TodoAct.submit({todoId: this.todo.id, toState});
		//this.toState = toState;
		this.returnCall(toState);
	}

	async showDialog(): Promise<number> {
		return await this.vCall(VAct);
		//return this.toState;
	}
}
