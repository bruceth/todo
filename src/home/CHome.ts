import { CUqBase } from "tonvaApp";
import { VMain } from "./VMain";

export class CHome extends CUqBase {
    protected async internalStart() {

    }
    tab = () => this.renderView(VMain);
}
