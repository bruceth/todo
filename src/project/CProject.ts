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
	parentId: number;
	@observable parentList: ProjectItem[];

	constructor(cApp: any) {
		super(cApp);
		this.parentId = 0;
	}

  protected async internalStart() {
	}

	init() {
		this.performance = this.uqs.performance;
		this.projectsPager = new ProjectPager(this.performance.GetMyProjects, 10, 500, true);
	}

	async load() {
		await this.projectsPager.first({parentId: this.parentId});
	}


	showList = async () => {
		this.load();
		this.openVPage(VProjectList);
	}

	async saveProject(name:string, content:string) {
		let data = { parent:this.parentId, name, content};
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
		this.projectsPager.items.clear();
		this.parentId = item.project.id;
		if (this.parentList === undefined) {
			this.parentList = [];
		}
		let litem = { 
			id: this.parentList.length, 
			project: item.project,
			name: item.name, 
			content:item.content
		}
		this.parentList.push(litem);
		await this.load();
	}

	async onSelectParentId(id:number) {
		if (id === this.parentId)
			return;
		if (id === 0) {
			this.parentId = id;
			this.parentList = undefined;
			await this.load();
			return;
		}
		if (this.parentList === undefined) {
			return;
		}
		for (let i = 0; i < this.parentList.length; ++i) {
			let item = this.parentList[i];
			if (item.project.id === id) {
				this.parentId = id;
				this.parentList.splice(i+1, this.parentList.length - i);
				await this.load();
				break;
			}
		}
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
