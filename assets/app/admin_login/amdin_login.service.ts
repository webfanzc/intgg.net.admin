/**
 * Created by gy104 on 17/8/18.
 */
import {Http, Headers} from "@angular/http";
import {Injectable} from "@angular/core";

import {AdminLogin} from "./amdin_login.model";


@Injectable()
export class AdminLoginService {
    private headers = {
        headers:new Headers({'Content-Type': 'application/json'})
    };
    constructor(private httpService: Http){}
    getAdmin(admin: AdminLogin): Promise<any>{
        const repath = "/admin/login";
        let body = JSON.stringify(admin);
        return this.httpService.post(repath,body,this.headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
                    return res;
                }
            )
    }
}