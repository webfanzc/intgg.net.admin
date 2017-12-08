import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'my-app',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private router: Router){}
    onlogout(){
        this.router.navigate(['/admin_login']);
        localStorage.clear();
    }
    isLoginIn() {
        return localStorage.getItem('token') !== null;
    }
}