/**
 * Created by gy104 on 17/4/1.
 */
import {Injectable, EventEmitter} from "@angular/core";
import {MdSnackBar} from "@angular/material";
import {Http, RequestOptions, Headers, URLSearchParams} from "@angular/http";
import { Router} from "@angular/router";
import 'rxjs/Rx'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import {Subject} from "rxjs/Subject";
import {Sticker} from "./sticker.verified.model";

@Injectable()
export class StickerService {
    private path: string = '?token='+localStorage.getItem('token');
    private stickers: Sticker[] = [];
    stickersChange: Subject<Sticker[]> = new Subject<Sticker[]>();
    stickersPage: Subject<any> = new Subject<any>();
    private  headers = {
        headers:new Headers({'Content-Type': 'application/json'})
    };
    constructor(private httpService: Http,private router: Router){}

    updateSticker(sticker: Sticker){
        let body = JSON.stringify(sticker);
        const repath = '/sticker/update'+this.path+'&_id='+sticker._id;
        this.httpService.post(repath, body, this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
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
        this.httpService.get(repath,{search: this.filterParams(params)})
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
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

    private filterParams(params: StickerSearchParams): URLSearchParams{
        return Object.keys(params)
            .filter(key => params[key])
            .reduce( (sum: URLSearchParams, key: string) => {
                sum.append(key, params[key]);
                return sum;
            },new URLSearchParams() )
    }

    getStickersPage(pageNum: number, pageSize: number) {
        let repath = '/sticker/list'+this.path +'&page'
    }

    getstickers(verified: number,pageNum?: number,pageSize?: number) :Promise<Sticker[]> {
        let page = '&pageSize='+pageSize+'&pageNum='+pageNum;
        const repath = '/sticker/list'+this.path+'&verified='+verified+page;
        return this.httpService.get(repath)
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
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



