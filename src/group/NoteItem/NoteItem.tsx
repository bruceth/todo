import { CGroup } from "group/CGroup";

export abstract class NoteItem {
	id: number;
	owner: number;
	$create: Date;
	protected readonly cGroup: CGroup
	constructor(cGroup: CGroup) {
		this.cGroup = cGroup;
	}
	abstract renderAsNote():JSX.Element;
	abstract renderInView():JSX.Element;
}
