import {CanActivate, Router} from "@angular/router";
import {Injectable} from "@angular/core";
/**
 * Created by gy104 on 17/8/18.
 */

@Injectable()
export class LoginGuard implements CanActivate{

    constructor(private router: Router){}
    canActivate(): boolean{
        var token = localStorage.getItem('token');
        if(token == null) {
            this.router.navigate(['/admin_login']);
        }else {
            return true;
        }
    }
}