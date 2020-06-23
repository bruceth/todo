import React from "react";
import { CSend, steps } from "./CSend";
import { VPage, FA, User, Image, UserView } from "tonva";
import { observer } from "mobx-react";
import { computed } from "mobx";

export class VSendBase extends VPage<CSend> {
	header() {return '分配任务'}
	right() {return <button className="btn btn-sm btn-secondary mr-2" onClick={this.controller.cancel}>取消</button>}
	get back():'none' {return 'none'}

	@computed protected get nextDisabled(): boolean { return false; }

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
		let btnPrev = <button className="btn btn-outline-primary mr-3" 
			style={{visibility: step===0?'hidden':'visible'}}
			onClick={prev}>
			<FA className="mr-2" name="arrow-left" /> 上一步
		</button>
		return <div>
			{this.renderCaption(this.controller.step)}
			<div className="mx-3 my-3">
				{this.renderMiddlePart()}
			</div>
			<div className="mx-3 my-3 text-center">
				{btnPrev} {btnNext}
			</div>
		</div>
		/*
				<div className="row">
				<div className="col-sm-2">{btnPrev}</div>
				<div className="col-sm-10 text-center">
					{btnNext}
				</div>
			</div>
		*/
	}

	protected renderMiddlePart() {
		return <div></div>;
	}

	protected renderUser(id:number|string, none?:any) {
		const cn = 'mr-5 my-2 d-flex align-items-center w-min-12c';
		let check = () => <FA name="check" className="text-primary mr-2" />;
		if (!id) return <div className={cn}><FA name="times" className="text-danger mr-2" /> {none}</div>;
		if (this.isMe(id) === true) {
			return <div className={cn + ' text-info'}>{check()}我自己</div>;
		}
		let renderUser = (user:User) => {
			let {name, nick, icon} = user;
			return <div className={cn}>
				{check()}
				<Image src={icon} className="w-1c h-1c mr-1" />
				<div>{nick || name}</div>
			</div>;
		}
		return <UserView key={id} user={Number(id)} render={renderUser} />
	}

	protected renderToList() {
		let arr:any[] = [];
		let {members} = this.controller;
		let me:any;
		for (let i in members) {
			if (members[i] === true) {
				if (this.isMe(i) === true) {
					me = i;
					continue;
				}
				arr.push(this.renderUser(i))
			}
		}
		return <div className="form-group">
			<label className="">执行人</label>
			<div className="">
		  		<div className="form-control-plaintext border bg-light px-3 py-2">
					<div className="d-flex flex-wrap">{arr}</div>
					{me && this.renderUser(me)}
				</div>
			</div>
	  	</div>;
	}

	protected renderChecker() {
		return <div className="form-group">
			<label className="">检查人</label>
			<div className="">
				<div className="form-control-plaintext border bg-light px-3 py-2">
					{this.renderUser(this.controller.checker, '无需检查')}
				</div>
			</div>
	  	</div>;
	}

	protected renderRater() {
		return <div className="form-group">
			<label className="">评价人</label>
			<div className="">
				<div className="form-control-plaintext border bg-light px-3 py-2">
					{this.renderUser(this.controller.rater, '无需评价')}
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
		return <div className="px-3 py-2 bg-white border rounded">
			<div className="d-flex flex-wrap">
				<label className={cn + ' text-warning'}>
					<input name={radioName} type="radio" className="mx-2" defaultChecked={userId===0}
						onChange={()=>setter(0)} />
					{none}
				</label>
				<label className={cn + ' text-info'}>
					<input name={radioName} type="radio" className="mx-2" defaultChecked={this.isMe(userId)}
						onChange={()=>setter(this.controller.user.id)} />
					我自己
				</label>
			</div>
			<div className="d-flex flex-wrap">
				{items.map((v, index) => {
					if (v.member === this.controller.user.id) return null;
					return <UserView user={v.member} render={renderUser} />
				})}
			</div>
		</div>
	}
}
