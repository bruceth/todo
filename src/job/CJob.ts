import { CUqBase, EnumTaskState } from "../tapp";
import { VJob } from "./VJob";
import { QueryPager } from "tonva";

export interface Doing {
	task: number; // ID ASC,
	assign: any; // ID Assign,
	worker: number; // ID,
	$create: Date; // TIMESTAMP, 
	state: EnumTaskState; 
	date: Date;		// task act time
}

export class CJob extends CUqBase {
	private loaded:boolean;
	myDoingsPager: QueryPager<Doing>;
	myArchiveTodosPager: QueryPager<any>;

    protected async internalStart() {
	}

	init() {
		this.myDoingsPager = new QueryPager(this.uqs.performance.GetMyTasks, 10, 100);
		this.loaded = false;
	}

	tab = () => this.renderView(VJob);

	load = async () => {
		if (this.loaded === true) return;
		this.loaded = true;
		await this.myDoingsPager.first({});
	}

	refresh = async() => {
		await this.myDoingsPager.refresh();
	}

	showTask = async (taskId: number) => {
		await this.cApp.showTask(taskId);
	}

	showMyAssigns = async () => {
		await this.cApp.showMyAssigns();
	}

	showMyTasks = async () => {
		await this.cApp.showMyTasks();
	}

	testText = async () => {
		let t = 'a\nb\ncc';
		await this.uqs.performance.TestText.submit({i: 1, tIn: t});
	}
}
