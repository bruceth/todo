import * as React from 'react';
import { nav } from './nav';
import { Page } from './page/page';

interface Props {
    message: string,
    seconds: number
}

interface State {
    seconds: number
}

export class ReloadPage extends React.Component<Props, State> {
    private timerHandler:any;
    constructor(props:Props) {
        super(props);
        this.state = {seconds: props.seconds};
        this.timerHandler = setInterval(() => {
            let seconds = this.state.seconds;
            seconds--;
            if (seconds <= 0) {
                this.reload();
            }
            else {
                this.setState({seconds: seconds});
            }
        }, 1000);
    }
    private reload = () => {
        clearInterval(this.timerHandler);
        nav.reload();
    }
    render() {
        return <Page header={false}>
            <div className="text-center p-5">
                <div className="text-info py-5">
                    程序升级中...
                    <br/>
                    {this.state.seconds}秒钟之后自动重启动
                    <br/>
                    <span className="small text-muted">{this.props.message}</span>
                </div>
                <button className="btn btn-danger" onClick={this.reload}>立刻重启</button>
            </div>
        </Page>;
    }
}

interface ConfirmReloadPageProps {
    confirm: (ok: boolean)=>Promise<void>;
}
export const ConfirmReloadPage = (props: ConfirmReloadPageProps):JSX.Element => {
    return <Page header="升级软件" back="close">
        <div className="py-5 px-3 my-5 mx-2 border bg-white rounded">
            <div className="text-center text-info">
                升级将清除所有本机缓冲区内容，并从服务器重新安装程序！
            </div>
            <div className="text-center mt-5">
                <button className="btn btn-danger mr-3" onClick={()=>props.confirm(true)}>确认升级</button>
            </div>
        </div>
    </Page>;
    // <button className="btn btn-outline-danger" onClick={()=>props.confirm(false)}>暂不</button>
}
