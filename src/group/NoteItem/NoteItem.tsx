import { Controller } from "tonva";

export abstract class NoteItem {
	id: number;
	owner: number;
	$create: Date;
	protected readonly controller: Controller
	constructor(controller: Controller) {
		this.controller = controller;
	}
	abstract renderAsNote(onClick:()=>void):JSX.Element;
	abstract renderInView():JSX.Element;
}
