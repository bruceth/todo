import * as React from 'react';
//import _ from 'lodash';
import { observer } from 'mobx-react';
import { Schema, UiSchema, ItemSchema, UiItem, UiRadio, UiTagSingle, UiTagMulti } from '../schema';
import { ItemEdit } from './itemEdit';
import { StringItemEdit } from './stringItemEdit';
import { ImageItemEdit } from './imageItemEdit';
import { RadioItemEdit } from './radioItemEdit';
import { SelectItemEdit } from './selectItemEdit';
import { IdItemEdit } from './idItemEdit';
import { TagSingleItemEdit, TagMultiItemEdit } from './tagItemEdit';
import { TextAreaItemEdit } from './textAreaItemEdit';

export interface EditProps {
    className?: string;
    schema: Schema;
    data: any;
    onItemClick?: (itemSchema: ItemSchema, uiItem: UiItem, value: any) => Promise<void>;
    onItemChanged?: (itemSchema: ItemSchema, newValue:any, preValue:any) => Promise<void>;
    stopEdit?: boolean;
    uiSchema?: UiSchema;
    sepClassName?: string;
    topBorderClassName?: string;
    bottomBorderClassName?: string;
    rowContainerClassName?: string;
}

@observer
export class Edit extends React.Component<EditProps> {
    private defaultSepClassName = 'border-top edit-sep-light-gray';
    private defaultRowContainerClassName = 'd-flex px-3 py-2 bg-white align-items-center';
    private topBorder:JSX.Element;
    private bottomBorder:JSX.Element;
    private rowContainerClassName?: string;
    private sep:JSX.Element;
	private uiSchema: {[name:string]: UiItem};

    constructor(props: EditProps) {
        super(props);
        let {topBorderClassName, bottomBorderClassName, sepClassName, rowContainerClassName, uiSchema, stopEdit} = props;
        this.topBorder = <div className={topBorderClassName || this.defaultSepClassName} />;
        this.bottomBorder = <div className={bottomBorderClassName || this.defaultSepClassName} />;
        this.rowContainerClassName = rowContainerClassName || this.defaultRowContainerClassName;
        if (stopEdit !== true) this.rowContainerClassName += ' cursor-pointer';
        this.sep = <div className={sepClassName || this.defaultSepClassName} />;
		this.uiSchema = (uiSchema && uiSchema.items) || {};
    }

    render() {
        let {schema} = this.props;
		let sep:any;
        return <div>
			{this.topBorder}
            {schema.map((itemSchema, index) => {
				let {name} = itemSchema;
				let uiItem = this.uiSchema===undefined? undefined : this.uiSchema[name];
				let label:string, labelHide:any;
				if (uiItem !== undefined) {
					label = uiItem.label || name;
					labelHide = uiItem.labelHide;
				};
				let value = this.props.data[name];
				let itemEdit = createItemEdit(itemSchema, uiItem, label, value);

				let {required} = itemSchema;
				let requireFlag = required===true && <span className="text-danger">*</span>;
				let divLabel:any, cn:string = 'flex-fill d-flex ';
				if (labelHide === true) {
					divLabel = undefined;
				}
				else {
					divLabel = <div>{label} {requireFlag}</div>;
					cn += 'justify-content-end';
				}
				let ret = <React.Fragment key={index}>
					{sep}
					<div className={'d-flex align-items-center' + this.rowContainerClassName} 
						onClick={async ()=>await this.rowClick(itemEdit)}>
						{divLabel}
						<div className={cn}>{
							itemEdit===undefined? undefined: itemEdit.renderContent()
						}</div>
						{this.props.stopEdit!==true && <div className="w-2c text-right"><i className="fa fa-angle-right" /></div>}
					</div>
				</React.Fragment>;
				sep = this.sep;
				return ret;
			})}
			{this.bottomBorder}
		</div>;
    }

	private rowClick = async (itemEdit:ItemEdit) => {
		if (itemEdit === undefined) {
			alert('item has no edit');
			return;
		}
		let {itemSchema, uiItem, value} = itemEdit;
        let {onItemChanged, onItemClick, stopEdit} = this.props;
        if (stopEdit === true) return;
        let changeValue:any;
        if (onItemClick !== undefined) {
            await onItemClick(itemSchema, uiItem, value);
            return;
        }
        //let itemEdit:ItemEdit = createItemEdit(itemSchema, uiItem, label, value);
        if (itemEdit === undefined) {
            alert('undefined: let itemEdit:ItemEdit = createItemEdit(itemSchema, uiItem, label, value);');
            return;
        }
        try {
            changeValue = await itemEdit.start();
            if (changeValue !== value) {
				// 2020-04-15：改值之后，应该赋值吧。所以移到这里来
				this.props.data[itemSchema.name] = changeValue;
                if (onItemChanged === undefined) {
                    alert(`${itemSchema.name} value changed, new: ${changeValue}, pre: ${value}`);
					// 2020-04-15：改值之后，应该赋值吧。所以这一句移到前面去
                    //this.props.data[itemSchema.name] = changeValue;
                }
                else {
                    await onItemChanged(itemSchema, changeValue, value);
                }
            }
            await itemEdit.end();
        }
        catch (err) {
            // 如果直接back，会触发reject，就到这里了
			console.log('no value changed');
			console.error(err);
        }
    }
}

type NewItemEdit = new (itemSchema: ItemSchema, uiItem:UiItem, label:string, value: any) => ItemEdit;

function createItemEdit(itemSchema: ItemSchema, uiItem:UiItem, label:string, value: any):ItemEdit {
	let ie: ItemEdit;
    let itemEdit: NewItemEdit;
    if (uiItem !== undefined) {
        switch (uiItem.widget) {
            default: break;
            case 'id': itemEdit = IdItemEdit; break;
			case 'text': itemEdit = StringItemEdit; break;
			case 'textarea': itemEdit = TextAreaItemEdit; break;
            case 'image': itemEdit = ImageItemEdit; break;
			case 'select': itemEdit = SelectItemEdit; break;
			case 'range': itemEdit = StringItemEdit; break;
            case 'radio': 
				ie = new RadioItemEdit(itemSchema, uiItem as UiRadio, label, value);
				break;
			case 'tagSingle':
				ie = new TagSingleItemEdit(itemSchema, uiItem as UiTagSingle, label, value);
				break;
			case 'tagMulti':
				ie = new TagMultiItemEdit(itemSchema, uiItem as UiTagMulti, label, value);
				break;
			}
	}
	if (ie === undefined) {
		if (itemEdit === undefined) {
			switch (itemSchema.type) {
				case 'string': itemEdit = StringItemEdit; break;
				case 'image': itemEdit = ImageItemEdit; break;
			}
		}
		if (itemEdit === undefined) return;
		ie = new itemEdit(itemSchema, uiItem, label, value);
	}
	ie.init();
	return ie;
}
