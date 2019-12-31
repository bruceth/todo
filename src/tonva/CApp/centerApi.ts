import {CenterApiBase} from '../net';

export class CenterApi extends CenterApiBase {
    async userAppUnits(app:number):Promise<any[]> {
        return await this.get('tie/user-app-units', {app:app});
    }
    async userFromId(userId:number):Promise<any> {
        return await this.get('user/user-name-nick-icon-from-id', {userId: userId});
    }
}

export const centerApi = new CenterApi('tv/', undefined);
