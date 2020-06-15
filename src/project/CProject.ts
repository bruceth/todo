import { CUqBase } from "tapp";
import { observable } from "mobx";
import { QueryPager, useUser, Tuid, BoxId } from "tonva";
import { VProjectList } from "./VProjectList";
import { Performance } from '../tapp'

export interface ProjectItem {
	id: number;
	project: BoxId;
	name: string;
	content: string;
	owner?: number;
}

export class CProject extends CUqBase {
	private performance: Performance;
	projectsPager: ProjectPager;

	constructor(cApp: any) {
		super(cApp);
	}

  protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.projectsPager = new ProjectPager(this.performance.GetMyProjects, 10, 500, true);
	}

	async load() {
		await this.projectsPager.first(undefined);
	}


	showList = async () => {
		this.load();
		this.openVPage(VProjectList);
	}

	async saveProject(name:string, content:string) {
		let data = { name, content};
		let ret = await this.performance.SaveProject.submit(data);
		let retProjectId = ret?.projectId as number;
		if (retProjectId > 0) {
			let projectBoxId = this.performance.Project.boxId(retProjectId);
			let nitem = { 
				id: this.projectsPager.items.length + 1, 
				project: projectBoxId,
				name: name,
				content: content,
				owner: this.user.id
			}
			this.projectsPager.items.unshift(nitem);
		}

		return retProjectId;
	}

	async onSelectItem(item:ProjectItem) {
	}
}

class ProjectPager extends QueryPager<ProjectItem> {
	protected getRefreshPageId(item:any) {
		if (item === undefined) return;
		let pageId = item['project'];
		if (typeof pageId === 'object') {
			return pageId.id;
		}
		return pageId;
	}
}
