/**
 * Created by gy104 on 17/4/1.
 */
import {Injectable, EventEmitter} from "@angular/core";
import { Router} from "@angular/router";
import 'rxjs/Rx'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Subject} from "rxjs/Subject";
import {Sticker} from "./sticker.verified.model";
import {HttpHeaders, HttpClient} from "@angular/common/http";
import {HttpParams} from "@angular/common/http";

@Injectable()
export class StickerService {
    private path: string = '?token='+localStorage.getItem('token');
    private stickers: Sticker[] = [];
    stickersChange: Subject<Sticker[]> = new Subject<Sticker[]>();
    stickersPage: Subject<any> = new Subject<any>();
    private headers = {
        headers: new HttpHeaders().set('Content-Type','application/json')
    };
    constructor(private httpService: HttpClient,private router: Router){}

    updateSticker(sticker: Sticker){
        let body = JSON.stringify(sticker);
        const repath = '/sticker/update'+this.path+'&_id='+sticker._id;
        this.httpService.post<any>(repath, body, this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    let value = res.data;
                    if(res.status == 200){
                        let stickers = new Sticker(
                            value.total,
                            sticker.materialid,
                            value._id,
                            value.createTime,
                            value.verified,
                            value.verifiedMsg,
                            value.intid
                        );
                        this.stickers[this.stickers.indexOf(sticker)] = stickers;
                        this.stickersChange.next(this.stickers);
                    }
                }
            )

    }


    searchSticker(verified: number,params: StickerSearchParams){
        let repath = '/sticker/list'+this.path+'&verified='+verified;
        return this.httpService.get<any>(repath,{params: this.filterParams(params)})
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    if(res.status == 200){
                        let data = res.data;
                        let stickers : Sticker[] = []
                        for(let value of data){
                            if(value.materialid != null){
                                stickers.push(new Sticker(
                                    value.total,
                                    value.materialid,
                                    value._id,
                                    value.createTime,
                                    value.verified,
                                    value.verifiedMsg,
                                    value.intid
                                    )
                                )
                            }
                        }
                        this.stickers = stickers;
                        this.stickersChange.next(this.stickers);
                        return res;
                    }
                }
            )

    }

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

    getStickersPage(pageNum: number, pageSize: number) {
        let repath = '/sticker/list'+this.path +'&page'
    }

    getstickers(verified: number,pageNum?: number,pageSize?: number) :Promise<Sticker[]> {
        let page = '&pageSize='+pageSize+'&pageNum='+pageNum;
        const repath = '/sticker/list'+this.path+'&verified='+verified+page;
        return this.httpService.get<any>(repath)
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    if(res.status == 200){
                        let data = res.data;
                        let stickers : Sticker[] = []
                        console.log(data);
                        for(let value of data){
                            if(value.materialid != null){
                                stickers.push(new Sticker(
                                    value.total,
                                    value.materialid,
                                    value._id,
                                    value.createTime,
                                    value.verified,
                                    value.verifiedMsg,
                                    value.intid
                                    )
                                )
                            }
                        }
                        this.stickers = stickers;
                        this.stickersChange.next(this.stickers);
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
        public total: string,
        public date: string
    ){}
}



