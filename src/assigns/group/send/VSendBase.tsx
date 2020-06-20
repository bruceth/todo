import React from "react";
import { CSend, steps } from "./CSend";
import { VPage, FA } from "tonva";

export class VSendBase extends VPage<CSend> {
	header() {return '分配任务'}
	right() {return <button className="btn btn-sm btn-secondary mr-2" onClick={this.controller.cancel}>取消</button>}
	get back():'none' {return 'none'}

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
			<button className="btn btn-primary" onClick={next}>
				<FA className="mr-2" name="arrow-right" /> 下一步
			</button>
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
		return <div className="form-group row">
			<label htmlFor="inputEmail3" className="col-sm-2 col-form-label">执行人</label>
			<div className="col-sm-10">
		  		<div className="form-control-plaintext border bg-light px-3 py-2">
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 
					asdf asf asdf asdf asdf asdf asdf sdaf asdfasdf 

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
}
