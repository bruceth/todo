import { CUqBase, EnumTaskState, Performance, EnumTaskAct } from "../tapp";
import { VMyTasks } from "./VMyTasks";
import { VReport } from "./VReport";
import { QueryPager } from "tonva";
import { AssignTask } from "models";
import { VMyTodos } from "./VMyTodos";

export interface Doing {
	task: number; // ID ASC,
	assign: any; // ID Assign,
	worker: number; // ID,
	$create: Date; // TIMESTAMP, 
	state: EnumTaskState; 
	date: Date;		// task act time
}

export class CReport extends CUqBase {
	private performance: Performance;
	//private loaded:boolean;
	myDoingsPager: QueryPager<Doing>;
	myArchiveTodosPager: QueryPager<any>;
	myTasksPager: QueryPager<AssignTask>;

    protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.myDoingsPager = new QueryPager(this.uqs.performance.GetMyTasks, 10, 100);
		//this.myTasksPager = new QueryPager(this.performance.GetMyTaskArchive, 10, 30, true);
		//this.loaded = false;
	}

	tab = () => this.renderView(VReport);

	load = async () => {
		//if (this.loaded === true) return;
		//this.loaded = true;
		//await this.myDoingsPager.first({});
	}

	refresh = async() => {
		//await this.myDoingsPager.refresh();
	}

	showTask = async (taskId: number) => {
		await this.cApp.showTask(taskId);
	}

	showMyAssigns = async () => {
		await this.cApp.showMyAssigns();
	}

	showMyTasks = async () => {
		await this.myTasksPager.first({});
		this.openVPage(VMyTasks);
	}

	showMyTodos = async () => {
		await this.myDoingsPager.first({});
		this.openVPage(VMyTodos);
	}

	async loadTaskArchive(step: EnumTaskAct) {
		this.myTasksPager.reset();
		await this.myTasksPager.first({step});
	}

	testText = async () => {
		let t = 'a\nb\ncc';
		await this.uqs.performance.TestText.submit({i: 1, tIn: t});
	}
}
