import * as React from 'react';
import _ from 'lodash';
import {nav, Page, resOptions} from '../components';
import { User, env } from '../tool';
import { Controller } from './controller';
import { VPage } from './vpage';

export abstract class View<C extends Controller> {
    protected controller: C;
    protected readonly res: any;
	protected readonly x: any;
	protected readonly t: (str:string)=>any;

    constructor(controller: C) {
        this.controller = controller;
        this.res = controller.res;
		this.x = controller.x;
		this.t = controller.t;
    }

    protected get isDev() {return  env.isDevelopment}

    abstract render(param?:any): JSX.Element;

    protected renderVm(vm: new (controller: C)=>View<C>, param?:any) {
        return (new vm(this.controller)).render(param);
    }

    protected async openVPage(vp: new (controller: C)=>VPage<C>, param?:any):Promise<void> {
        await (new vp(this.controller)).open(param);
    }

    protected async event(type:string, value?:any) {
        /*
        if (this._resolve_$_ !== undefined) {
            await this._resolve_$_({type:type, value:value});
            return;
        }*/
        await this.controller.event(type, value);
    }

    async vCall<C extends Controller>(vp: new (controller: C)=>VPage<C>, param?:any):Promise<any> {
        return await this.controller.vCall(vp, param);
    }

    protected returnCall(value:any) {
        this.controller.returnCall(value);
    }

    protected openPage(view: React.StatelessComponent<any>, param?:any) {
        let type = typeof param;
        if (type === 'object' || type === 'undefined') {
            this.controller.openPage(React.createElement(view, param));
        }
        else {
            this.controller.openPage(<Page header="param type error">
                View.openPage param must be object, but here is {type}
            </Page>);
        }
    }

    protected replacePage(view: React.StatelessComponent<any>, param?:any) {
        this.controller.replacePage(React.createElement(view, param));
    }

    protected openPageElement(page: JSX.Element) {
        this.controller.openPage(page);
    }

    protected replacePageElement(page: JSX.Element) {
        this.controller.replacePage(page);
    }

    protected backPage() {
        this.controller.backPage();
    }

    protected closePage(level?:number) {
        this.controller.closePage(level);
    }

    protected ceasePage(level?:number) {
        this.controller.ceasePage(level);
    }

    protected removeCeased() {
        this.controller.removeCeased();
    }

    protected regConfirmClose(confirmClose: ()=>Promise<boolean>) {
        this.controller.regConfirmClose(confirmClose);
    }
}
