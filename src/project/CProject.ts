import { CUqBase } from "tapp";
import { VProjectList } from "./VProjectList";

export class CProject extends CUqBase {
    protected async internalStart() {
	}

	showList = async () => {
		this.openVPage(VProjectList);
	}
}