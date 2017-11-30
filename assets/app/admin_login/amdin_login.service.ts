/**
 * Created by gy104 on 17/8/18.
 */
import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";

import {AdminLogin} from "./amdin_login.model";
import {HttpClient, HttpHeaders} from "@angular/common/http";


@Injectable()
export class AdminLoginService {
    private headers = {
        headers: new HttpHeaders().set('Content-Type','application/json')
    };
    constructor(private httpService: HttpClient){}
    getAdmin(admin: AdminLogin): Promise<any>{
        const repath = "/admin/login";
        let body = JSON.stringify(admin);
        return this.httpService.post<any>(repath,body,this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response;
                    return res;
                }
            )
    }
}