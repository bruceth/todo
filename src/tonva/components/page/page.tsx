import * as React from 'react';
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

export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    right?: JSX.Element;
    footer?: JSX.Element;
    logout?: boolean | (()=>Promise<void>);
	headerClassName?: string;
	className?: string;
	bgClassName?: string;
	afterBack?: () => void;
	tabsProps?: TabsProps;
}

@observer
export class Page extends React.Component<PageProps> {
	private tabsView: TabsView;
    constructor(props: PageProps) {
		super(props);
		let {tabsProps} = props;
		if (tabsProps) {
			this.tabsView = new TabsView(tabsProps);
		}
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
			/>;
		return pageHeader;
	}

	private renderFooter() {
		const {footer} = this.props;
		if (footer) {
			let elFooter = <footer>{footer}</footer>;
			return <>
				<section className="tv-page-footer">{elFooter}</section>
				{elFooter}
			</>;
		}
	}

    render() {
		if (this.tabsView) {
			return React.createElement(this.tabsView.content);
		}
		const {onScroll, onScrollTop, onScrollBottom, children, className, bgClassName} = this.props;
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
}
