import { CHome } from "home/CHome";

export abstract class NoteItem {
	id: number;
	owner: number;
	$create: Date;
	protected readonly cGroup: CHome
	constructor(cGroup: CHome) {
		this.cGroup = cGroup;
	}
	abstract renderAsNote():JSX.Element;
	abstract renderInView():JSX.Element;
}
