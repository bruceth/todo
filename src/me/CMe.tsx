import _ from 'lodash';
import { CUqBase } from '../tonvaApp';
import { VMe } from './VMe';

export class CMe extends CUqBase {
    protected async internalStart() {

    }
    tab = () => this.renderView(VMe);
}