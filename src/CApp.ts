import { CAppBase, IConstructor } from "tonva";
import 'bootstrap/dist/css/bootstrap.css';
import { CUqBase } from "./tonvaApp/CBase";
import { UQs } from "./tonvaApp/uqs";
import { VMain } from './tonvaApp/main';
import { CMe } from "me/CMe";
import { CHome } from "home/CHome";
import { CGroup } from "group/CGroup";
import { CJob } from "job/CJob";

export class CApp extends CAppBase {
    get uqs(): UQs { return this._uqs };

	cGroup: CGroup;
	cTodo: CJob;
    cHome: CHome;
    cMe: CMe;

    protected newC<T extends CUqBase>(type: IConstructor<T>): T {
        return new type(this);
    }

    protected async internalStart() {
		let {test1, test2} = this.uqs.performance;
		let [values1, values2] = await Promise.all([
			test1.loadValues(),
			test2.loadValues()
		]);
 
		this.cGroup = this.newC(CGroup);
		this.cGroup.load();
		this.cTodo = this.newC(CJob);
		this.cTodo.start();
        this.cHome = this.newC(CHome);
        this.cMe = this.newC(CMe);
        /*
        this.cPosts = this.newC(CPosts);
        this.cMedia = this.newC(CMedia);
        this.cTemplets = this.newC(CTemplets);
        */
	   this.showMain();
    }

    showMain(initTabName?: string) {
        this.openVPage(VMain, initTabName);
    }
}
