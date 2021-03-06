/**
 * Created by gy104 on 17/4/1.
 */
import {Injectable, EventEmitter} from "@angular/core";
import {Http, RequestOptions, Headers, URLSearchParams} from "@angular/http";
import { Router} from "@angular/router";
import 'rxjs/Rx'
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';

import {Material} from './material.verified.model'
import {Subject} from "rxjs/Subject";
import {HttpClient, HttpHeaders,HttpParams} from "@angular/common/http";

@Injectable()
export class MaterialService {
    materialsChange: Subject<Material[]>= new Subject<Material[]>();
    materiasPage: Subject<any> = new Subject<any>();
    private materials : Material[] = [];
    materialsSearch : Material[] = [];
    private headers = {
        headers: new HttpHeaders().set('Content-Type','application/json')
    };
    path: string = '?token='+localStorage.getItem('token');
    constructor(private httpService: HttpClient ,private router: Router){}

    updateMaterial(material: Material){
        const body = JSON.stringify(material);
        console.log(body)
        let repath = '/materials/update'+this.path+ '&_id='+material._id;
        return this.httpService.post<any>(repath,body,this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    let data = res.data;
                    if(res.status == 200) {
                        this.materials[this.materials.indexOf(material)] = new Material(
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
                        this.materialsChange.next(this.materials);
                    }
                    return this.materials;
                }
            )

    }


    //模糊查询素材
    searchMaterialByName(name:string): Promise<Material[]>{
        let repath = '/materials/list'+this.path+'&name='+name;
        return this.httpService.get<any>(repath)
            .toPromise()
            .then(
                (response) => {

                    let res = response;
                    let messages = res.data;
                    let materials: Material[] = [];
                    if(res.status == 200 ) {
                        for (let message of messages) {
                            materials.push(new Material(
                                message.name,
                                message.position,
                                message.link,
                                message.url,
                                message.content,
                                message.type,
                                message.createTime,
                                message._id,
                                message.verified,
                                message.verifiedMsg)
                            );
                        }
                        this.materialsSearch = materials;
                        this.materialsChange.next(materials);
                        return materials;
                    }

                }
            )
    }
    //搜索素材
    searchMaterial(params: MaterialSearchParams){
        let repath = '/materials/list'+this.path;
        return this.httpService.get<any>(repath,{params: this.filterParams(params)})
            .toPromise()
            .then(
                (response) => {
                    let messages = response.data;
                    let materials: Material[] = [];
                    for (let message of messages) {
                        materials.push(new Material(
                            message.name,
                            message.position,
                            message.link,
                            message.url,
                            message.content,
                            message.type,
                            message.createTime,
                            message._id,
                            message.verified,
                            message.verifiedMsg,
                            message.intid)
                        );
                    }
                    this.materials = materials;
                    this.materialsChange.next(materials);
                    return materials;
                }
            )
    }


    private filterParams(params: MaterialSearchParams){
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

    //上传文件

    uploadFile( file: any ) {
        const url = '/upload/index?'+this.path;
        return this.httpService.post<any>(url,file)
            .toPromise()
            .then(
                (res) => {
                    if(res.status == 200) {
                        return res;
                    }else if(res.status == 400){
                        // this.snackBar.open(res.json().msg,'',{
                        //     duration: 2000,
                        //
                        // })
                        return;
                    }

                }
            )
    }

    getMaterialsPage(pageNum: number, pageSize: number){
        let repath = '/materials/list?'+this.path+'&pageSize='+pageSize+'&pageNum='+pageNum;;
        return this.httpService.get<any>(repath)
            .toPromise()
            .then((response) => {
                    let res = response;
                    const messages = res.data;
                    let materials: Material[] = [];
                    for (let message of messages) {
                        materials.push(new Material(
                            message.name,
                            message.position,
                            message.link,
                            message.url,
                            message.content,
                            message.type,
                            message.createTime,
                            message._id,
                            )
                        );
                    }
                    this.materials = materials;
                    this.materialsChange.next(this.materials);
                    return res;
                }

            )
    }


    getMaterial(index: number) {
       return this.materials[index];
    }


    getMaterials(verified: number,pageNum?: number, pageSize?:number) :Promise<Material[]> {
        let page = '&pageSize='+pageSize+'&pageNum='+pageNum;
        let repath = '/materials/list'+this.path+'&verified='+verified+page;
        return this.httpService.get<any>(repath)
            .toPromise()
            .then((response) => {
                    let res = response;
                    const messages = res.data;
                    let materials: Material[] = [];
                    if(res.status == 505) {
                        this.router.navigate(['/admin_login'])
                        return null;
                    }
                    if(res.status == 200){
                        for (let message of messages) {
                            materials.push(new Material(
                                message.name,
                                message.position,
                                message.link,
                                message.url,
                                message.content,
                                message.type,
                                message.createTime,
                                message._id,
                                message.verified,
                                message.verifiedMsg,
                                message.intid)
                            );
                        }
                        this.materials = materials;
                        this.materialsChange.next(this.materials);
                        this.materiasPage.next(res);
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

export class MaterialSearchParams {
    constructor(
        public type: string,
        public position: string,
        public date: string
    ){}
}



