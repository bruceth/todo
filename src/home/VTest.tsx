import * as React from 'react';
import { Page, VPage, ImageUploader } from 'tonva';
import { CHome } from './CHome';

export class VTest extends VPage<CHome> {
    async open(param?: any) {
        this.openPage(this.page);
        let a:any = param;
        let c = a?.b;
    }

    private page = () => {
        return <ImageUploader size="lg" />
    }
}
