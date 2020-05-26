import * as React from 'react';
import { VPage, Page, Form, ItemSchema, Schema, UiSchema, UiTagMulti, UiTagSingle, Context, Edit, List } from 'tonva';
import { CHome } from './CHome';
import { observable } from 'mobx';

const itemBlock = "p-3 border border-info mr-1 mb-1 w-10c cursor-pointer bg-white rounded";
const itemStyle = {maxWidth: '45%'};

export class VMain extends VPage<CHome> {
	private schema:Schema = [
		{name: 'a', type: 'string'},
		{name: 'b', type: 'string'},
		{name: 'c', type: 'string'},
		{name: 'submit', type: 'submit'}
	];
	private uiSchema: UiSchema;

	@observable private data:any = {
		b:3, 
		c:'2|4'
	}

    async open(param?: any) {
	}

	private submit = async (name:string, context:Context ):Promise<void> => {
		alert(name + ': ' + JSON.stringify(context.data));
	}

	private onEditItemChanged = async (itemSchema: ItemSchema, newValue:any, preValue:any): Promise<void> => {
		this.data[itemSchema.name] = newValue;
	}

    render() {
		this.uiSchema = {
			items: {
				b: { 
					label: '单选Radio',
					widget: 'tagSingle', 
					valuesView: this.controller.tagTest1.view,
					
				} as UiTagSingle,
				c: {
					label: '多选CheckBox',
					widget: 'tagMulti', 
					valuesView: this.controller.tagTest2.view,
					wrapClassName: 'row-cols-sm-2'
				} as UiTagMulti,
				submit: {
					label: '提交',
					widget: 'button',
					className: 'btn btn-primary'
				}
			}
		}

        let arr = [
            'adfas1fd', 'asdfddddsadf', 'adsfasf', 'sdafsdf dsf a',
            'adfasfd', 'asdfsadf', 'adsfasf', 'sdafsdf dsf a',
            'adfasfd', 'asdfsadf', 'adsfasf', 'sdafsdf dsf a',
        ]
        return <Page header="首页" headerClassName="bg-info">
			<div className="m-3">
				<button className="mr-3 btn btn-outline-primary" onClick={this.controller.test}>Test</button>
				<button className="mr-3 btn btn-outline-primary" onClick={this.controller.testParser}>测试表达式</button>
				<button className="mr-3 btn btn-outline-primary" onClick={this.controller.actionTestExpression}>actionTestExpression</button>
			</div>
			<List items={[]} item={{render:this.renderListItem}} />
            <div className="d-flex flex-wrap m-3 justify-content-start">
                {arr.map((v, index) => <div key={index} className={itemBlock} style={itemStyle} onClick={()=>alert(v)}>{v}</div>)}
            </div>
			<Form className="p-3" 
				schema={this.schema} 
				uiSchema={this.uiSchema}
				formData={this.data}
				fieldLabelSize={2}
				onButtonClick={this.submit} />
			<Edit className="p-3" 
				schema={this.schema}
				uiSchema={this.uiSchema}
				data={this.data}
				onItemChanged={this.onEditItemChanged}
			 />
        </Page>;
	}
	
	private renderListItem = (item:any, index:number) => {
		return <div>1</div>;
	}
}
