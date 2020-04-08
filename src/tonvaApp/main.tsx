import * as React from 'react';
import { VPage, TabCaptionComponent, Page, Tabs } from 'tonva';
import { CApp } from '../CApp';
// import { setting } from 'configuration';

const color = (selected: boolean) => selected === true ? 'text-primary' : 'text-muted';

export class VMain extends VPage<CApp> {
    async open(param?: any) {
        this.openPage(this.render);
    }
    // opensrc = () => {
    //     window.open(setting.downloadAppurl);
    // }

    render = (param?: any): JSX.Element => {
        let { cGroup, cTodo, cHome, cMe/*, cPosts, cMedia, cTemplets*/ } = this.controller;
        let faceTabs = [
			{ name: 'note', label: '首页', icon: 'home', content: cGroup.tab, },
			{ name: 'todo', label: '工作', icon: 'list', content: cTodo.tab, onShown: cTodo.load },
            { name: 'home', label: '绩效', icon: 'tasks', content: cHome.tab, },
            { name: 'me', label: '我的', icon: 'user', content: cMe.tab }
        ].map(v => {
            let { name, label, icon, content, onShown/*, notify, onShown*/ } = v;
            return {
                name: name,
                caption: (selected: boolean) => TabCaptionComponent(label, icon, color(selected)),
                content: content,
                //notify: notify,
                onShown: onShown,
            }
		});
		return <Tabs tabs={faceTabs} />;
		/*
        return <Page header={false} headerClassName={"bg-info"} >
            <Tabs tabs={faceTabs} />
        </Page>;
		//
		*/
    }
}
