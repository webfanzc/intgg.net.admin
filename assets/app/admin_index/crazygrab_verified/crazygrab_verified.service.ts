/**
 * Created by gy104 on 17/4/1.
 */
import {Injectable, EventEmitter} from "@angular/core";
import { Router} from "@angular/router";
import 'rxjs/Rx'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Subject} from "rxjs/Subject";
import {HttpHeaders, HttpClient} from "@angular/common/http";
import {HttpParams} from "@angular/common/http";
import {Crazygrab} from "./crazygrab_verified.model";

@Injectable()
export class CrazygrabService {
    private path: string = '?token='+localStorage.getItem('token');
    private crazygrabs: Crazygrab[] = [];
    stickersChange: Subject<Crazygrab[]> = new Subject<Crazygrab[]>();
    stickersPage: Subject<any> = new Subject<any>();
    private headers = {
        headers: new HttpHeaders().set('Content-Type','application/json')
    };
    constructor(private httpService: HttpClient,private router: Router){}

    updateCrazygrab(crazygrab: Crazygrab){
        let body = JSON.stringify(crazygrab);
        const repath = '/crazygrab/update'+this.path+'&_id='+crazygrab._id;
        return this.httpService.post<any>(repath, body, this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    let value = res.data;
                    console.log(res);
                    if(res.status == 200){
                        let crazy = new Crazygrab(
                            value.total,
                            value.redType,
                            value.weight,
                            value.startTime,
                            value.endTime,
                            value.sex,
                            value.prinvce,
                            value.city,
                            value.minAge,
                            value.maxAge,
                            crazygrab.materialid,
                            value.minRed,
                            value.maxRed,
                            value._id,
                            value.use,
                            value.createTime,
                            value.intid,
                            value.verified,
                            value.verifiedMsg
                        );
                        this.crazygrabs[this.crazygrabs.indexOf(crazy)] = crazy;
                        this.stickersChange.next(this.crazygrabs);
                        return crazy;
                    }
                }
            )

    }

    // delMoney(stickerid: string,intid: string) {
    //     let repath = '/moneys/del'+this.path+'&sourceId='+stickerid+'&intid='+intid;
    //     this.httpService.post(repath,null,this.headers)
    //         .subscribe(
    //             (reponse) => {
    //                 console.log(reponse);
    //             }
    //         )
    // }
    //
    // delSticker(sticker: Sticker) {
    //     let body = JSON.stringify(sticker);
    //     let repath = '/sticker/del'+this.path+'&_id='+sticker._id;
    //     return this.httpService.post(repath, body, this.headers);
    // }
    //
    // searchSticker(verified: number,key: string, value?: any){
    //     let repath = '/sticker/list'+this.path+'&verified='+verified;
    //     if(value) {
    //         repath = repath +'&'+key+'='+value;
    //     }
    //
    //     return this.httpService.get<any>(repath)
    //         .toPromise()
    //         .then(
    //             (response) => {
    //                 let res = response;
    //                 if(res.status == 200){
    //                     let data = res.data;
    //                     let stickers : Sticker[] = []
    //                     for(let value of data){
    //                         if(value.materialid != null){
    //                             stickers.push(new Sticker(
    //                                 value.total,
    //                                 value.startDate,
    //                                 value.endDate,
    //                                 value.materialid,
    //                                 value._id,
    //                                 value.createTime,
    //                                 value.verified,
    //                                 value.verifiedMsg,
    //                                 value.intid,
    //                                 value.isStart
    //                                 )
    //                             )
    //                         }
    //                     }
    //                     this.stickers = stickers;
    //                     this.stickersChange.next(this.stickers);
    //                     return res;
    //                 }
    //             }
    //         )
    //
    // }

    private filterParams(params: StickerSearchParams):HttpParams{
        let ret = new HttpParams();
        if (params) {
            // tslint:disable-next-line:forin
            for (const key in params) {
                let _data = params[key];
                if (_data != null) {
                    ret = ret.set(key, _data);
                }

            }
        }
        return ret;
    }

    getCrazygrabs(verified: number,pageNum?: number,pageSize?: number) :Promise<Crazygrab[]> {
        let page = '&pageSize='+pageSize+'&pageNum='+pageNum;
        const repath = '/crazygrab/list'+this.path+'&verified='+verified+page;
        return this.httpService.get<any>(repath)
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    console.log(res);
                    if(res.status == 200){
                        let data = res.data;
                        let stickers : Crazygrab[] = []
                        for(let value of data){
                            if(value.materialid != null){
                                stickers.push(new Crazygrab(
                                    value.total,
                                    value.redType,
                                    value.weight,
                                    value.startTime,
                                    value.endTime,
                                    value.sex,
                                    value.prinvce,
                                    value.city,
                                    value.minAge,
                                    value.maxAge,
                                    value.materialid,
                                    value.minRed,
                                    value.maxRed,
                                    value._id,
                                    value.use,
                                    value.createTime,
                                    value.intid,
                                    value.verified,
                                    value.verifiedMsg
                                    )
                                )
                            }
                        }
                        this.crazygrabs = stickers;
                        this.stickersChange.next(this.crazygrabs);
                        this.stickersPage.next(res);
                        return res;
                    }
                    if(res.status == 505) {
                        this.router.navigate(['/admin_login'])
                    }

                }
            )
    }
}
//
export class StickerSearchParams {
    constructor(
        public total: number,
        public date: string
    ){}
}



