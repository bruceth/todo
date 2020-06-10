import { CUqBase } from "../tapp";
import { VMain } from "./VMain";
import { VTestForm } from "./VTestForm";
import { test } from "parser/test";

export class CTest extends CUqBase {
    protected async internalStart() {
		// eslint-disable-next-line
		let values1 = this.uqs.performance.test1.values;
		// eslint-disable-next-line
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
        this.openVPage(VTestForm);
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
