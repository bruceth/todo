import * as React from 'react';
import { Page, VPage, ImageUploader, Form, ItemSchema, UiSchema, UiTextItem, ButtonWidget, UiButton, NumSchema, UiTextAreaItem } from 'tonva';
import { CHome } from './CHome';

export class VTest extends VPage<CHome> {
    async open(param?: any) {
        this.openPage(this.page);
        let a:any = param;
        let c = a?.b;
    }

    private page = () => {
        let items:ItemSchema[] = [
            {name: 'name1', type: 'string', required: true},
            {name: 'name2', type: 'string'},
            {name: 'num', type: 'number', min: 10, max: 50} as NumSchema,
            {name:'submit', type:'button'}
        ];
        let uis: UiSchema = {
            items: {
                name1: {widget: 'text', label: '姓名', placeholder: '请输入姓名'} as UiTextItem,
                name2: {widget: 'textarea', label: '姓名2', placeholder: '请输入姓名2'} as UiTextAreaItem,
                submit: {widget: "button", label: '提交', className: 'btn btn-success'} as UiButton
            }
        }
 
        return <Page header="试验">
            <Form className="m-3"
                schema={items}
                uiSchema={uis} fieldLabelSize={3} />
        </Page>
        //return <ImageUploader size="lg" />
    }
}
