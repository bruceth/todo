import * as React from 'react';
import { observable } from 'mobx';
import {
    userApi, ItemSchema, StringSchema, ImageSchema, UiTextItem, UiImageItem, nav, Page,
    Edit, UiSchema,
    VPage, UiRadio, IdSchema, UiIdItem, Context, BoxId, tv
} from 'tonva';
import { CMe } from './CMe';

export class EditMeInfo extends VPage<CMe> {
    async open(param: any) {
        this.openPage(this.page);
    }
    private page = () => {
      //  let { schema, uiSchema, data, onItemChanged, webUserData, onWebUserChanged, webUserContactData, onWebUserContactChanged, controller } = this;
        return <Page header="个人信息">
            <div>我的</div>
            {/* <Edit schema={schema} uiSchema={uiSchema}
                data={data}
                onItemChanged={onItemChanged} />
            <Edit schema={webUserSchema} uiSchema={webUserUiSchema}
                data={webUserData}
                onItemChanged={onWebUserChanged} />
            <Edit schema={webUserContactSchema} uiSchema={webUserContactUiSchema(controller.pickAddress)}
                data={webUserContactData}
                onItemChanged={onWebUserContactChanged} /> */}
        </Page>;
    }
}