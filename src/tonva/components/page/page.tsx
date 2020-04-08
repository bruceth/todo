import * as React from 'react';
import _ from 'lodash';
import {observer} from 'mobx-react';
import classNames from 'classnames';
import {PageHeader} from './pageHeader';
import { TabsProps, TabsView } from './tabs';

export interface IVPage {
	content():JSX.Element;
	header():JSX.Element;
	footer():JSX.Element;
}

const scrollAfter = 20; // 20ms之后，scroll执行
export class Scroller {
    private el: HTMLBaseElement;
    constructor(el: HTMLBaseElement) {
        this.el = el;
    }

    scrollToTop():void {
        setTimeout(() => this.el.scrollTo(0, 0), scrollAfter);
    }
    scrollToBottom():void {
        setTimeout(() => this.el.scrollTo(0, this.el.scrollTop + this.el.offsetHeight), scrollAfter);
    }
}

export interface ScrollProps {
    onScroll?: (e:any) => void;
    onScrollTop?: (scroller: Scroller) => void;
	onScrollBottom?: (scroller: Scroller) => void;
	bgClassName?: string;
}
interface ScrollViewProps extends ScrollProps {
    className?: string;
}
const scrollTimeGap = 100;
class ScrollView extends React.Component<ScrollViewProps, null> {
    private bottomTime:number = 0;
    private topTime:number = 0;

    private onScroll = async (e:any) => {
        let {onScroll, onScrollTop, onScrollBottom} = this.props;
        if (onScroll) this.props.onScroll(e);
        let el = e.target as HTMLBaseElement;
        let scroller = new Scroller(el);
        if (el.scrollTop < 30) {
            //this.eachChild(this, 'top');
            if (onScrollTop !== undefined) {
                let topTime = new Date().getTime();
                if (topTime-this.topTime > scrollTimeGap) {
                    this.topTime = topTime;
                    onScrollTop(scroller);
                }
            }
        }
        if (el.scrollTop + el.offsetHeight > el.scrollHeight - 30) {
            //this.eachChild(this, 'bottom');
            if (onScrollBottom !== undefined) {
                let bottomTime = new Date().getTime();
                if (bottomTime - this.bottomTime > scrollTimeGap) {
                    this.bottomTime = bottomTime;
                    onScrollBottom(scroller);
                }
            }
        }
    }
    private eachChild(c:any, direct:'top'|'bottom') {
        let { props } = c;
        if (props === undefined)
            return;
        let { children } = props;
        if (children === undefined)
            return;
        React.Children.forEach(children, (child, index) => {
            let {_$scroll} = child as any;
            if (_$scroll) _$scroll(direct);
            console.log(child.toString());
            this.eachChild(child, direct);
        });
	}
	
    render() {
		let {className, bgClassName} = this.props;
        return <div className={classNames('tv-page', bgClassName)} onScroll={this.onScroll}>
			<article className={className}>
				{this.props.children}
			</article>
		</div>;
    }
}
/*
export interface Tab extends ScrollProps {
    title: string | JSX.Element;    
    icon?: string;
    className?: string;
    content?: JSX.Element | (()=>JSX.Element);
    header?: string;
    isSelected?: boolean;
    redDot?: IComputedValue<number>;
    load?: () => Promise<void>;
}
export interface TabState extends Tab {
    isMounted?: boolean;
}
*/
export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    //keepHeader?: boolean;
    right?: JSX.Element;
    //sideBar?: JSX.Element;
    footer?: JSX.Element;
    //tabs?: Tab[];
    //tabPosition?: 'top' | 'bottom';
    logout?: boolean | (()=>Promise<void>);
	headerClassName?: string;
	className?: string;
	bgClassName?: string;
	afterBack?: () => void;
	tabsProps?: TabsProps;
}
/*
export interface PageState {
    cur?: Tab;
    tabs?: TabState[];
}
*/
@observer
export class Page extends React.Component<PageProps/*, PageState*/> {
	private tabsView: TabsView;
    constructor(props: PageProps) {
		super(props);
		let {tabsProps} = props;
		if (tabsProps !== undefined) {
			this.tabsView = new TabsView(tabsProps);
		}
	}

	//private tabs:TabState[];
	/*
    constructor(props: PageProps) {
        super(props);
		let {tabs} = props;
        if (tabs === undefined || tabs.length === 0) return;
        this.tabs = tabs;
        let cur:Tab;
        let tabStates:Tab[] = [];
        for (let tab of tabs) {
            let t:TabState = _.clone(tab);
            if (cur === undefined) {
                if (t.isSelected === true)
                    cur = t;
                else
                    t.isSelected = false;
            }
            else {
                t.isSelected = false;
            }
            t.isMounted = false;
            tabStates.push(t);
        }
        this.state = {
            cur: cur,
            tabs: tabStates,
        };
	}
	*/

	/*
    async componentDidMount() {
        if (this.tabs === undefined) return;
        let t0 = this.state.tabs.find(v => v.isSelected === true);
        if (t0 === undefined) {
            t0 = this.state.tabs[0];
            if (t0 === undefined) return;
        }
        await t0.load?.();
	}
	*/

	/*
    private async onTabClick(tab: TabState) {
        if (tab.isSelected === true) return;
        let cur:TabState;
        let tabs = this.state.tabs;
        for (let t of tabs) {
            if (t === tab) {
                t.isSelected = true;
                cur = t;
            }
            else
                t.isSelected = false;
        }
        if (cur.isMounted !== true) {
            let {load} = cur;
            if (load !== undefined) {
                await load();
            }
        }
        this.setState({
            cur: cur,
            tabs: tabs
        });
    }

    private onTouchStart(evt: React.TouchEvent<HTMLElement>) {
    }

    private renderTabs(footer: JSX.Element) {
        const {header, back, right, keepHeader, headerClassName, tabPosition, afterBack} = this.props;
        let cur = this.state.cur;
        let tabs = <div>{
                this.state.tabs.map((tab, index) => {
                    const {icon, isSelected, title, redDot, className} = tab;
                    let img:any, redDotView:any, cn:any;
                    if (icon !== undefined) img = <img src={icon} alt="tab icon" />;
                    if (redDot !== undefined) {
                        let v = redDot.get();
                        if (v < 0) {
                            cn = classNames('red-dot', className);
                            redDotView = <u />;
                        }
                        else if (v > 0) {
                            cn = classNames('red-dot', 'num', className);
                            redDotView = <u>{v}</u>;
                        }
                    }
                    return <div key={index}
                        className= {classNames('va-tab', {cur: isSelected})}
                        onClick={() => this.onTabClick(tab)}>
                        {img}<div className={cn}>{title}{redDotView}</div>
                    </div>
                })
            }</div>;
        let pageHeader = header !== false &&
            <PageHeader 
                back={back} 
                center={keepHeader===true? (header as string) : (cur && (cur.header || cur.title))}
                right={right}
				className={headerClassName}
				afterBack={afterBack}
            />;

        return <article className='page-container'>
            {pageHeader}
            {tabPosition==='top' && tabs}
            <section className="position-relative">
            {this.props.sideBar}
            {
                this.state.tabs.map((tab, index) => {
                    let {isSelected, isMounted, content} = tab;
                    if (isSelected === true || isMounted === true) {
                        tab.isMounted = true;
                        return <ScrollView key={index}
                            className={classNames({invisible: isSelected===false})}
                            onScroll={tab.onScroll}
                            onScrollTop={tab.onScrollTop}
                            onScrollBottom={tab.onScrollBottom}
                        >
                            {(typeof content)==='function'? (content as ()=>JSX.Element)():content}
                        </ScrollView>;
                    }
                    return undefined;
                })
            }
            </section>
            {tabPosition!=='top' && tabs}
            {footer}
        </article>;
	}
	*/
    private renderSingle(footer: JSX.Element) {
        const {back, header, right, onScroll, onScrollTop, onScrollBottom, children, headerClassName, afterBack} = this.props;
        let pageHeader = header !== false && <PageHeader 
            back={back} 
            center={header as any}
            right={right}
            logout={this.props.logout}
            className={headerClassName}
			afterBack={afterBack}
			/>;
		return <ScrollView
			onScroll={onScroll}
			onScrollTop={onScrollTop}
			onScrollBottom={onScrollBottom}
		>
			{pageHeader}
			<main>
			{children}
			</main>
			{footer}
		</ScrollView>;

		/*
        return <article onTouchStart={this.onTouchStart}>
			<section className="vpage-header">
				{pageHeader}
			</section>
			<section className="position-relative vpage-body">
				{this.props.sideBar}
				<ScrollView
					onScroll={onScroll}
					onScrollTop={onScrollTop}
					onScrollBottom={onScrollBottom}
				>
					{pageHeader}
					{children}
					{footer}
				</ScrollView>
			</section>
			<section className="vpage-footer">
				{footer}
			</section>
		</article>;
		*/
    }

	private renderHeader() {
		const {back, header, right, headerClassName, afterBack} = this.props;
		let pageHeader = header !== false && <PageHeader 
			back={back} 
			center={header as any}
			right={right}
			logout={this.props.logout}
			className={headerClassName}
			afterBack={afterBack}
			// ex={this.tabsView === undefined? undefined : this.tabsView.headerTabs()}
			/>;
		return pageHeader;
	}

	private renderFooter() {
		const {footer} = this.props;
		//let elTabs = this.tabsView === undefined? undefined : this.tabsView.footerTabs();
		if (footer) {
			let elFooter = <footer>{footer}</footer>;
			return <>
				<section className="tv-page-footer">{elFooter}</section>
				{elFooter}
			</>;
		}
	}

    render() {
		const {onScroll, onScrollTop, onScrollBottom, children, tabsProps, className, bgClassName} = this.props;
		if (tabsProps === undefined) {
			return <ScrollView
				onScroll={onScroll}
				onScrollTop={onScrollTop}
				onScrollBottom={onScrollBottom}
				className={className}
				bgClassName={bgClassName}
			>
				{this.renderHeader()}
				<main>{children}</main>
				{this.renderFooter()}
			</ScrollView>;
		}
		return <this.tabsView.content />;
	}
}
