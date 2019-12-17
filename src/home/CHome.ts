import { CUqBase } from "tonvaApp";
import { VMain } from "./VMain";
import { test } from "parser/test";

export class CHome extends CUqBase {
    protected async internalStart() {

    }
    tab = () => this.renderView(VMain);

    test = () => {
        test();
    }
}
