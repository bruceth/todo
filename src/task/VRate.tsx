import * as React from 'react';
import { FA } from "tonva";
import { VTaskBase } from './VTaskBase';
import { observable } from 'mobx';
import { observer } from 'mobx-react';

export class VRate extends VTaskBase {
	header() {return '评价';}

	private onRate = async () => {
		await this.controller.rateTask();
		this.closeAction('任务评价完成，归档');
	}

	@observable submitDisabled: boolean = true;
	protected renderCommands():JSX.Element {
		let render = observer(() => {
			let {id} = this.task;
			let onChange = async (evt:React.ChangeEvent<HTMLInputElement>) => {
				let rated:1|-1|100 = Number(evt.target.value) as 1|-1|100;
				this.submitDisabled = rated === undefined;
			};
			let vRadio = (val:number, color:string, icon:string, text:string) => {
				return <label className={'mb-0 mx-3 text-' + color}>
					<input className="" type="radio" value={val} 
						name={'rt-' + id} onChange={onChange} />
					<FA className="mx-2" name={icon} /> 
					<span className="">{text}</span>
				</label>;
			}
			return <div className="">
				<div className="d-flex align-items-center px-3 py-3">
					{vRadio(1, 'success', 'check', '及格')}
					{vRadio(1, 'dangger', 'times', '不及格')}
					<div className="flex-grow-1" />
					{vRadio(1, 'primary', 'thumbs-o-up', '卓越')}
				</div>
				<div className="px-3">
					<textarea className={'w-100 form-control border-info'} placeholder={'评价内容'} rows={6} />
				</div>
				<div className="d-flex align-items-center px-3 py-3">
					<button className="btn btn-success" onClick={this.onRate} disabled={this.submitDisabled}>
						<FA className="mr-2" name="check-circle" /> 提交评价
					</button>
				</div>
			</div>;
		});
		return React.createElement(render);
	}
}
