import { CUqBase } from "tonvaApp";
import { VMain } from "./VMain";
import { VTest } from "./VTest";
import { test } from "parser/test";

export class CHome extends CUqBase {
    protected async internalStart() {
		let values1 = this.uqs.performance.test1.values;
		let values2 = this.uqs.performance.test2.values;
	}
	
	get tagTest1() {
		return this.uqs.performance.test1;
	}

	get tagTest2() {
		return this.uqs.performance.test2;
	}

    tab = () => this.renderView(VMain);

    test = () => {
        this.openVPage(VTest);
    }

    testParser = () => {
        alert(test());
    }

    actionTestExpression = async () => {
        let rev = test();

        let data = {
            name: 'subject3',
            a: rev,
        };
        await this.uqs.performance.TestExpression.submitConvert(data);
    }
}
