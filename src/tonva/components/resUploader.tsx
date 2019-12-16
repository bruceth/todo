import * as React from 'react';
import { nav } from './nav';
import { Image } from './image';
import { Page } from './page';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { env } from '../tool';

export interface ResUploaderProps {
    className?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

export class ResUploader extends React.Component<ResUploaderProps> {
    private fileInput: HTMLInputElement;

    upload = async ():Promise<string> => {
        let {maxSize} = this.props;
        if (maxSize === undefined || maxSize <= 0) 
            maxSize = 100000000000;
        else
            maxSize = maxSize * 1024;
        let resUrl = nav.resUrl + 'upload';
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            if (file.size > maxSize) return null;
            data.append('files[]', file, file.name);
        }
  
        try {
            let abortController = new AbortController();
            let res = await fetch(resUrl, {
                method: "POST",
                body: data,
                signal: abortController.signal,
            });
            let json = await res.json();
            return ':' + json.res.id;
        }
        catch (err) {
            console.error('%s %s', resUrl, err);
        }
    }
    render() {
        let {className, multiple, onFilesChange} = this.props;
        return <input 
            className={className}
            ref={t=>this.fileInput=t} 
            onChange={onFilesChange}
            type='file' name='file' multiple={multiple} />
    }
}

interface ImageUploaderProps {
    id?: string|number;
    label?: string;
    onSaved?: (imageId:string) => Promise<void>;
}

@observer
export class ImageUploader extends React.Component<ImageUploaderProps> {
    private resUploader: ResUploader;
    @observable private isChanged: boolean = false;
    @observable private resId: string;
    @observable private overSize: boolean = false;

    private upload = async () => {
        if (!this.resUploader) return;
        let ret = await this.resUploader.upload();
        if (ret === null) {
            this.overSize = true;
            env.setTimeout('imageItemEdit upload', () => this.overSize = false, 3000);
            return;
        }
        this.resId = ret;
        this.isChanged = (this.resId !== this.props.id);
    }

    private onSaved = (): Promise<void> => {
        let {onSaved} = this.props;
        onSaved && onSaved(this.resId);
        return;
    }

    render() {
        let {label} = this.props;
        let right = <button
            className="btn btn-sm btn-success align-self-center mr-2"
            disabled={!this.isChanged}
            onClick={this.onSaved}>保存</button>;
        let overSize:any;
        if (this.overSize === true) {
            overSize = <div className="text-danger">
                <i className="fa fa-times-circle" /> 图片文件大小超过2M，无法上传
            </div>;
        }
        return <Page header={label || '更改图片'} right={right}>
            <div className="my-3 px-3 py-3 bg-white">
                <div>
                    <div>上传图片：</div>
                    <div className="my-3">
                        <ResUploader ref={v=>this.resUploader=v} multiple={false} maxSize={2048} />
                    </div>
                    <div>
                        <button className="btn btn-primary" onClick={this.upload}>上传</button>
                    </div>
                </div>
                {overSize}
                <div className="small muted my-4">支持JPG、GIF、PNG格式图片，不超过2M。</div>
                <div className="d-flex">
                    <div className="w-12c h-12c mr-4"
                        style={{border: '1px dotted gray', padding: '8px'}}>
                        <Image className="w-100 h-100" src={this.resId} />
                    </div>
                    <div>
                        <div className="small">图片预览</div>
                        <Image className="w-4c h-4c mt-3" src={this.resId} />
                    </div>
                </div>
            </div>
        </Page>;
    }
}
