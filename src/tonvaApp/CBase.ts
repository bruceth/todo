import { CSub, CBase } from 'tonva';
import { UQs } from './uqs';
import { CApp } from '../CApp';

export abstract class CUqBase extends CBase {
    get cApp(): CApp { return this._cApp; }
    protected get uqs(): UQs { return this._uqs as UQs };
}

export abstract class CUqSub extends CSub {
    get cApp(): CApp { return this.cApp; }
    protected get uqs(): UQs { return this._uqs as UQs };
    protected get owner(): CUqBase { return this._owner as CUqBase }
}
