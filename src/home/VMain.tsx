import * as React from 'react';
import { nav, Image, VPage, Prop, IconText, FA, PropGrid, LMR, Page } from 'tonva';
// import { observable } from 'mobx';
// import { observer } from 'mobx-react';
// import { EditMeInfo } from './EditMeInfo';
// import { appConfig } from 'configuration';
import { CHome } from './CHome';

const itemBlock = "p-3 border border-info mr-1 mb-1 w-10c cursor-pointer bg-white rounded";
const itemStyle = {maxWidth: '45%'};

export class VMain extends VPage<CHome> {
    async open(param?: any) {

    }
    render() {
        let arr = [
            'adfas1fd', 'asdfddddsadf', 'adsfasf', 'sdafsdf dsf a',
            'adfasfd', 'asdfsadf', 'adsfasf', 'sdafsdf dsf a',
            'adfasfd', 'asdfsadf', 'adsfasf', 'sdafsdf dsf a',
        ]
        return <Page header="首页" headerClassName="bg-info">
            <button onClick={this.controller.test}>Test</button>
            <button onClick={this.controller.testParser}>测试表达式</button>
            <button onClick={this.controller.actionTestExpression}>actionTestExpression</button>
            <div className="d-flex flex-wrap mt-3 ml-2 justify-content-start">
                {arr.map((v, index) => <div key={index} className={itemBlock} style={itemStyle} onClick={()=>alert(v)}>{v}</div>)}
            </div>
        </Page>;
    }
}
