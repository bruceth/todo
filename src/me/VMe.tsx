import * as React from 'react';
import { nav, Image, VPage, Prop, IconText, FA, PropGrid, LMR, Page } from 'tonva';
// import { observable } from 'mobx';
// import { observer } from 'mobx-react';
// import { EditMeInfo } from './EditMeInfo';
// import { appConfig } from 'configuration';
import { CMe } from './CMe';
import config from '../../package.json';

export class VMe extends VPage<CMe> {
    private arr: string[] = ['dddd', 'ccc', 'eee', 'fff'];

    async open(param?: any) {
    }
    render() {
        for (let i=0; i<30; i++) {
            this.arr.push('曹 ' + i);
        }
    
        return <Page logout={true}>
            曹泽锐 <br/>
            <div className="h3 text-danger">
                A A 
                {this.arr.map((v, index) => {
                    return <div key={index} className="border p-3">{v}</div>;
                })}
                <span className="text-success">B b</span>
            </div>
            版本：{config.version}
        </Page>;
    }


   
}
