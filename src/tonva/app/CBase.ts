import { Controller } from "../vm";
import { IConstructor } from "./CAppBase";

export abstract class CBase extends Controller {
    protected readonly _uqs: any;
    protected readonly _cApp: any;

    constructor(cApp: any) {
        super(undefined);
        this._cApp = cApp;
        this._uqs = cApp && cApp.uqs;
	}

    protected get uqs(): any {return this._uqs}
	get cApp(): any {return this._cApp}

	internalT(str:string):any {
		let r = super.internalT(str);
		if (r!==undefined) return r;
		return this._cApp.internalT(str);
	}

    protected newC<T extends CBase>(type: IConstructor<T>):T {
        return new type(this.cApp);
    }

    protected newSub<T extends CSub>(type: IConstructor<T>):T {
        return new type(this);
    }
}

export abstract class CSub extends CBase {
    protected _owner: CBase;

    constructor(owner: CBase) {
        super(owner.cApp);
        this._owner = owner;
	}

	internalT(str:string):any {
		let r = super.internalT(str);
		if (r!==undefined) return r;
		return this._owner.internalT(str);
	}

    protected get owner(): CBase {return this._owner}
}
