import React from "react";
import { CSend, steps } from "./CSend";
import { VPage, FA, User, Image, UserView } from "tonva";
import { observer } from "mobx-react";
import { observable } from "mobx";

export class VSendBase extends VPage<CSend> {
	header() {return '分配任务'}
	right() {return <button className="btn btn-sm btn-secondary mr-2" onClick={this.controller.cancel}>取消</button>}
	get back():'none' {return 'none'}

	@observable protected nextDisabled: boolean = false;

	protected renderCaption(step: number) {
		return <div className="d-flex align-items-center justify-content-center my-3">
			{steps.map((v, index) => {
				let {caption} = v;
				let p:any, d:any;
				if (index > 0) {
					p = <FA className="mx-3 text-muted" name="arrow-right" />;
				}
				if (index === step) {
					d = <b className="h4 mb-0 text-primary">{caption}</b>;
				}
				else {
					d = <div className="text-muted">{caption}</div>;
				}
				return <>{p}{d}</>;
			})}
		</div>
	}

	content() {
		let {step, prev, next, sendout} = this.controller;
		let btnNext = step < steps.length-1 ?
			React.createElement(observer(()=>
				<button className="btn btn-primary" onClick={next} disabled={this.nextDisabled}>
					<FA className="mr-2" name="arrow-right" /> 下一步
				</button>)
			)
			:
			<button className="btn btn-primary" onClick={sendout}>发出任务</button>;
		let btnPrev = <button className="btn btn-outline-primary" 
			style={{visibility: step===0?'hidden':'visible'}}
			onClick={prev}>
			<FA className="mr-2" name="arrow-left" /> 上一步
		</button>
		return <div>
			{this.renderCaption(this.controller.step)}
			<div className="mx-3 my-3">
				{this.renderMiddlePart()}
			</div>
			<div className="mx-3 my-3">
				<div className="row">
					<div className="col-sm-2">{btnPrev}</div>
					<div className="col-sm-10 text-center">
						{btnNext}
					</div>
				</div>
			</div>
		</div>
	}

	protected renderMiddlePart() {
		return <div></div>;
	}

	protected renderToList() {
		let arr:any[] = [];
		let {members} = this.controller;
		let renderUser = (user:User) => {
			let {id, name, nick, icon} = user;
			return <div className="mr-5 my-2 d-flex align-items-center w-min-12c">
				<Image src={icon} className="w-1c h-1c mr-1" />
				<div>{nick || name}</div>
			</div>;
		}
		for (let i in members) {
			if (members[i] === true) {
				arr.push(<UserView key={i} user={Number(i)} render={renderUser} />)
			}
		}
		return <div className="form-group row">
			<label className="col-sm-2 col-form-label">执行人</label>
			<div className="col-sm-10">
		  		<div className="form-control-plaintext border bg-light px-3 py-2 d-flex flex-wrap">
					{arr}
				</div>
			</div>
	  	</div>;
	}

	protected renderChecker() {
		return <div className="form-group row">
			<label htmlFor="inputEmail3" className="col-sm-2 col-form-label">检查人</label>
			<div className="col-sm-10">
				<div className="form-control-plaintext border bg-light px-3 py-2">
					检查人
				</div>
			</div>
	  	</div>;
	}

	protected renderRater() {
		return <div className="form-group row">
			<label htmlFor="inputEmail3" className="col-sm-2 col-form-label">评价人</label>
			<div className="col-sm-10">
				<div className="form-control-plaintext border bg-light px-3 py-2">
					评价人
				</div>
			</div>
	  	</div>;
	}

	protected renderRadios(radioName:string, userId:number, setter: (userId:number)=>void, none:string) {
		const cn = 'mr-5 my-2 d-flex align-items-center w-min-12c';
		let items = this.controller.membersPager.items;
		let renderUser = (user:User) => {
			let {id, name, nick, icon} = user;
			let onChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
				setter(Number(evt.target.value));
			};
			return <label className={cn}>
				<input name={radioName} type="radio" className="mx-2" 
					defaultChecked={id===userId}
					value={id} onChange={onChange} />
				<Image src={icon} className="w-1c h-1c mr-1" />
				<div>{nick || name}</div>
			</label>;
		}
		return <div className="d-flex px-3 py-2 bg-white border rounded flex-wrap">
			<label className={cn + ' text-warning'}>
				<input name={radioName} type="radio" className="mx-2" defaultChecked={userId===-1}
					onChange={()=>this.controller.checker=undefined} />
				{none}
			</label>
			<label className={cn + ' text-info'}>
				<input name={radioName} type="radio" className="mx-2" defaultChecked={userId===this.controller.user.id}
					onChange={()=>this.controller.checker=this.controller.user.id} />
				我自己
			</label>
			{items.map((v, index) => {
				if (v.member === this.controller.user.id) return;
				return <UserView user={v.member} render={renderUser} />
			})}
		</div>
	}
}
