import * as React from 'react';
import { FA } from "tonva";
import { VTaskBase } from './VTaskBase';

export class VTaskRate extends VTaskBase {
	header() {return '评价';}

	private onRate = async () => {
		await this.controller.rateTask();
		this.popToPage();
	}

	/*
	content() {
		let {todos} = this.task;
		return <div className="bg-white">
			{this.renderTop()}
			{this.renderTodos(todos)}
			<div className="d-flex align-items-center px-3 py-2">
				<button className="btn btn-success" onClick={this.onRate}>
					<FA className="mr-2" name="check-circle" /> 评价
				</button>
				<div className="flex-fill"></div>
			</div>
		</div>;
	}
	*/

	protected renderCommands():JSX.Element {
		return <div className="d-flex align-items-center px-3 py-2">
			<button className="btn btn-success" onClick={this.onRate}>
				<FA className="mr-2" name="check-circle" /> 评价
			</button>
			<div className="flex-fill"></div>
		</div>;
	}
}
