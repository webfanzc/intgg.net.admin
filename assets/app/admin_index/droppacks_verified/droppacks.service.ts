/**
 * Created by gy104 on 17/11/7.
 */
/**
 * Created by gy104 on 17/4/1.
 */
import {Injectable} from "@angular/core";
import {Http, Headers, URLSearchParams} from "@angular/http";
import { Router} from "@angular/router";
import 'rxjs/Rx'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import {Droppack} from './droppacks.model'
import {Subject} from "rxjs/Subject";

@Injectable()
export class DroppackService {
    droppacksChange: Subject<Droppack[]>= new Subject<Droppack[]>();
    droppacksPage: Subject<any> = new Subject<any>();
    private droppacks : Droppack[] = [];
    droppacksSearch : Droppack[] = [];
    private headers = {
        headers:new Headers({'Content-Type': 'application/json'})
    };
    path: string = '?token='+localStorage.getItem('token');
    constructor(private httpService: Http ,private router: Router){}

    updateDroppack(droppack: Droppack){
        const body = JSON.stringify(droppack);
        console.log(body)
        let repath = '/droppacks/update'+this.path+ '&_id='+droppack._id;
        return this.httpService.post(repath,body,this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
                    let data = res.data;
                    if(res.status == 200) {
                        this.droppacks[this.droppacks.indexOf(droppack)] = new Droppack(
                            data.name,
                            data.position,
                            data.link,
                            data.url,
                            data.content,
                            data.type,
                            data.createTime,
                            data._id,
                            data.verified,
                            data.verifiedMsg,
                        )
                        this.droppacksChange.next(this.droppacks);
                    }
                    return this.droppacks;
                }
            )

    }


    //模糊查询素材
    searchDroppackByName(name:string): Promise<Droppack[]>{
        let repath = '/droppacks/list'+this.path+'&packname='+name;
        return this.httpService.get(repath)
            .toPromise()
            .then(
                (response) => {

                    let res = response.json();
                    let messages = res.data;
                    let droppacks: Droppack[] = [];
                    if(res.status == 200 ) {
                        let data = res.data;
                        for (let droppack of data) {
                            droppacks.push(new Droppack(
                                droppack.packname,
                                droppack.brand,
                                droppack.brandlogo,
                                droppack.classType,
                                droppack._id,
                                droppack.intid,
                                droppack.configInfo,
                                droppack.prizesInfo,
                                droppack.createTime,
                                droppack.verified,
                                droppack.verifiedMsg))
                        }
                        this.droppacks = droppacks;
                        this.droppacksChange.next(this.droppacks);
                        console.log(droppacks);
                        this.droppacksPage.next(res);
                        return res;
                    }

                }
            )
    }
    //搜索素材
    searchDroppack(params: DroppackSearchParams): Promise<Droppack[]>{
        let repath = '/droppacks/list'+this.path;
        return this.httpService.get(repath,{search: this.filterParams(params)})
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
                    let messages = res.data;
                    let droppacks: Droppack[] = [];
                    if (res.status == 200) {
                        let data = res.data;
                        for (let droppack of data) {
                            droppacks.push(new Droppack(
                                droppack.packname,
                                droppack.brand,
                                droppack.brandlogo,
                                droppack.classType,
                                droppack._id,
                                droppack.intid,
                                droppack.configInfo,
                                droppack.prizesInfo,
                                droppack.createTime,
                                droppack.verified,
                                droppack.verifiedMsg))
                        }
                        this.droppacks = droppacks;
                        this.droppacksChange.next(this.droppacks);
                        console.log(droppacks);
                        this.droppacksPage.next(res);
                        return res;
                    }
                }
            )
    }


    private filterParams(params: DroppackSearchParams): URLSearchParams{
        return Object.keys(params)
            .filter(key => params[key])
            .reduce( (sum: URLSearchParams, key: string) => {
                sum.append(key, params[key]);
                return sum;
            },new URLSearchParams() )
    }

    // getMaterialsPage(pageNum: number, pageSize: number){
    //     let repath = '/materials/list?'+this.path+'&pageSize='+pageSize+'&pageNum='+pageNum;;
    //     return this.httpService.get(repath)
    //         .toPromise()
    //         .then((response) => {
    //                 let res = response.json();
    //                 const messages = res.data;
    //                 let materials: Material[] = [];
    //                 for (let message of messages) {
    //                     materials.push(new Material(
    //                         message.name,
    //                         message.position,
    //                         message.link,
    //                         message.url,
    //                         message.content,
    //                         message.type,
    //                         message.createTime,
    //                         message._id,
    //                         )
    //                     );
    //                 }
    //                 this.materials = materials;
    //                 this.materialsChange.next(this.materials);
    //                 return res;
    //             }
    //
    //         )
    // }


    getDroppack(index: number) {
        return this.droppacks[index];
    }


    getDroppacks(verified: number,pageNum?: number, pageSize?:number) :Promise<Droppack[]> {
        let page = '&pageSize='+pageSize+'&pageNum='+pageNum;
        let repath = '/droppacks/list'+this.path+'&verified='+verified+page;
        return this.httpService.get(repath)
            .toPromise()
            .then((response) => {
                    let res = response.json();
                    let droppacks: Droppack[] = [];
                    if(res.status == 505) {
                        this.router.navigate(['/admin_login'])
                        return null;
                    }
                    if(res.status == 200){
                        let data = res.data;
                        for (let droppack of data) {
                            droppacks.push(new Droppack(
                                droppack.packname,
                                droppack.brand,
                                droppack.brandlogo,
                                droppack.classType,
                                droppack._id,
                                droppack.intid,
                                droppack.configInfo,
                                droppack.prizesInfo,
                                droppack.createTime,
                                droppack.verified,
                                droppack.verifiedMsg))
                        }
                        this.droppacks = droppacks;
                        this.droppacksChange.next(this.droppacks);
                        console.log(droppacks);
                        this.droppacksPage.next(res);
                        return res;
                    }



                }

            )


    }
    // private handleError(error: any): Promise<any> {
    //     console.error('An error occurred', error); // for demo purposes only
    //     return Promise.reject(error.message || error);
    // }

}

export class DroppackSearchParams {
    constructor(
        // public type: string,
        // public position: string,
        public date: string
    ){}
}



