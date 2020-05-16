import { CUqBase } from '../tapp';
import { VMe } from './VMe';

export class CMe extends CUqBase {
    protected async internalStart() {

    }
    tab = () => this.renderView(VMe);
}