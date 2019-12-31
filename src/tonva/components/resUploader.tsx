import * as React from 'react';
import { nav } from './nav';
import { Image as ImageControl } from './image';
import { Page } from './page';
import { observer } from 'mobx-react';
import { observable } from 'mobx';
import { LMR } from './simple';

export interface ResUploaderProps {
    className?: string;
    label?: string;
    multiple?: boolean;
    maxSize?: number;
    onFilesChange?: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

@observer
export class ResUploader extends React.Component<ResUploaderProps> {
    private fileInput: HTMLInputElement;
    @observable private fileName: string;

    buildFormData():FormData {
        let {maxSize} = this.props;
        if (maxSize === undefined || maxSize <= 0) 
            maxSize = 100000000000;
        else
            maxSize = maxSize * 1024;
        var files:FileList = this.fileInput.files;
        var data = new FormData();
        let len = files.length;
        for (let i=0; i<len; i++) {
            let file = files[i];
            if (file.size > maxSize) return null;
            data.append('files[]', file, file.name);
        }
    }

    getFile0(): File {
        return this.fileInput.files[0];
    }

    upload = async (formData?: FormData):Promise<string|{error:any}> => {
        let resUrl = nav.resUrl + 'upload';
        if (!formData) formData = this.buildFormData();
        try {
            nav.startWait();
            let headers = new Headers();
            headers.append('Access-Control-Allow-Origin', '*');
            //2019-12-18：因为 vivo按oppo某些版本不支持，暂时先不要 
            //let abortController = new AbortController();
            let res = await fetch(resUrl, {
                method: "POST",
                body: formData,
                headers: headers,
                //signal: abortController.signal,
            });
            let json = await res.json();
            return ':' + json.res.id;
        }
        catch (err) {
            console.error('%s %s', resUrl, err);
            return {error:err};
        }
        finally {
            nav.endWait();
        }
    }

    private onFilesChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        let {onFilesChange} = this.props;
        if (onFilesChange) onFilesChange(evt);
        let files = evt.target.files;
        let len = files.length;
        let names:string[] = [];
        for (let i=0; i<len; i++) {
            names.push(files.item(i).name);
        }
        this.fileName = names.join(', ');
    }

    render() {
        let {className, multiple, label} = this.props;
        return <div>
                <label className="btn btn-outline-success">
                    {label || '选择文件'} 
                    <input 
                        className={className}
                        ref={t=>this.fileInput=t} 
                        onChange={this.onFilesChange}
                        type='file' name='file' 
                        multiple={multiple} style={{display:'none'}} />
                </label>
                &nbsp;
                {this.fileName}
            </div>
    }
}

interface ImageUploaderProps {
    id?: string;
    label?: string;
    size?: 'sm' | 'lg';
    onSaved?: (imageId:string) => Promise<void>;
}

const imageTypes = ['gif', 'jpg', 'jpeg', 'png'];
const largeSize = 800;
const smallSize = 180;

@observer
export class ImageUploader extends React.Component<ImageUploaderProps> {
    private imgBaseSize: number;
    private file: File;
    private suffix: string;
    private resUploader: ResUploader;
    @observable private isChanged: boolean = false;
    @observable private resId: string;
    @observable private enableUploadButton: boolean = false;
    @observable private srcImage: string;
    @observable private desImage: string;
    @observable private fileError: string;
    @observable private uploaded: boolean = false;

    constructor(props: ImageUploaderProps) {
        super(props);
        this.resId = props.id;
        this.imgBaseSize = props.size === 'lg'? largeSize : smallSize;
    }

    private onFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
        this.fileError = undefined;
        this.uploaded = false;
        this.enableUploadButton = evt.target.files.length > 0;
        if (this.enableUploadButton) {
            this.file = evt.target.files[0];
            let pos = this.file.name.lastIndexOf('.');
            if (pos >= 0) this.suffix = this.file.name.substr(pos+1).toLowerCase();
            if(imageTypes.indexOf(this.suffix) < 0){
                this.fileError = `图片类型必须是 ${imageTypes.join(', ')} 中的一种`;
                return;
            }
            let reader = new FileReader();
            reader.readAsDataURL(this.file);
            reader.onload = async () => {
                this.srcImage = reader.result as string;
                this.desImage = await this.compress();
            };
        }
    }

    private compress = ():Promise<string> => {
        return new Promise<string>((resolve, reject) => {
            var img = new Image();
            img.src = this.srcImage;
            img.onload = () => {
                //var that = this;
                // 默认按比例压缩
                let {width, height} = img;
                let scale = width / height;
                let w:number, h:number;
                if (scale < 0) {
                    w = this.imgBaseSize;
                    h = w / scale;
                }
                else {
                    h = this.imgBaseSize;
                    w = h * scale;
                }
                var quality = 0.7;  // 默认图片质量为0.7
                //生成canvas
                var canvas = document.createElement('canvas');
                var ctx = canvas.getContext('2d');
                // 创建属性节点
                var anw = document.createAttribute("width");
                anw.nodeValue = String(w);
                var anh = document.createAttribute("height");
                anh.nodeValue = String(h);
                canvas.setAttributeNode(anw);
                canvas.setAttributeNode(anh);
                ctx.drawImage(img, 0, 0, w, h);
                let base64 = canvas.toDataURL('image/' + this.suffix , quality);
                if (base64.length > 5000000) {
                    this.fileError = "文件太大，无法上传";
                    this.enableUploadButton = false;
                }
                resolve(base64);
            }
        });
    }

    private convertBase64UrlToBlob(urlData: string):Blob {
        let arr = urlData.split(',');
        let mime = arr[0].match(/:(.*?);/)[1];
        let bstr = atob(arr[1]);
        let n = bstr.length;
        let u8arr = new Uint8Array(n);
        while(n--){
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new Blob([u8arr], {type:mime});
    }

    private upload = async () => {
        if (!this.resUploader) return;
        let formData = new FormData();
        let blob = this.convertBase64UrlToBlob(this.desImage);
        formData.append('image', blob, this.file.name);
        let ret = await this.resUploader.upload(formData);
        if (typeof ret === 'object') {
            let {error} = ret;
            let type = typeof error;
            let err:string;
            switch (type) {
                case 'undefined': err = 'error: undefined'; break;
                case 'string': err = error; break;
                case 'object': err = error.message; break;
                default: err = String(err); break;
            }
            this.fileError = 'error: ' + type + ' - ' + err;
            return;
        }
        this.resId = ret;
        this.isChanged = (this.resId !== this.props.id);
        this.uploaded = true;
    }

    private onSaved = (): Promise<void> => {
        let {onSaved} = this.props;
        onSaved && onSaved(this.resId);
        return;
    }

    private showOrgImage = () => {
        nav.push(<Page header="原图">
            <div className="p-3 text-center">
                <ImageControl className="h-min-4c" style={{maxWidth:'100%'}} src={this.srcImage} />
            </div>
        </Page>);
    }

    render() {
        let {label} = this.props;
        let right = <button
            className="btn btn-sm btn-success align-self-center mr-2"
            disabled={!this.isChanged}
            onClick={this.onSaved}>保存</button>;
        return <Page header={label || '更改图片'} right={right}>
            <div className="my-3 px-3 py-3 bg-white">
                <div>
                    <div className="mb-3">
                        <ResUploader ref={v=>this.resUploader=v} 
                            multiple={false} maxSize={2048} 
                            label="选择图片文件"
                            onFilesChange={this.onFileChange} />
                        <div className="small text-muted">支持 {imageTypes.join(', ')} 格式图片。</div>
                        {this.fileError && <div className="text-danger">{this.fileError}</div>}
                    </div>
                    <LMR left=
                    {
                        this.enableUploadButton && (
                            this.uploaded === true? 
                                <div className="text-success p-2">上传成功！</div>
                                :
                                <div className="mb-3">
                                    <button className="btn btn-primary" onClick={this.upload}>上传</button>
                                </div>
                        )
                    }
                    right={this.desImage && <button className="btn btn-link btn-sm" onClick={this.showOrgImage}>查看原图</button>}
                    ></LMR>
                </div>
                <div className="text-center" 
                    style={{
                        border: (this.uploaded===true? '2px solid green' : '1px dotted gray'),
                        padding: '8px'
                    }}>
                    <ImageControl className="h-min-4c" style={{maxWidth:'100%'}} src={this.desImage} />
                </div>
            </div>
        </Page>;
    }
}
/*
<div className="w-12c h-12c mr-4"
style={{border: '1px dotted gray', padding: '8px'}}>
<ImageControl className="w-100 h-100" src={this.srcImage} />
</div>
<div>
<div className="small">图片预览</div>
<ImageControl className="w-4c h-4c mt-3" src={this.desImage} />
</div>
*/
