/**
 * Created by gy104 on 17/8/18.
 */
import {Component, OnInit} from "@angular/core";
import {AdminLoginService} from "./amdin_login.service";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {AdminLogin} from "./amdin_login.model";

@Component({
    selector: 'admin_login',
    templateUrl: 'admin_login.component.html',
    styleUrls: [
        'admin_login.component.css'
    ],
    providers: [
        AdminLoginService
    ]
})

export class AdminLoginComponent implements OnInit {

    loginForm: FormGroup;
    height: string;
    errmsg: string;
    constructor(private loginService: AdminLoginService,private router: Router){
        this.height = window.innerHeight + 'px';
    }


    onSubmit() {
        let values = this.loginForm.value;
        let admin = new AdminLogin(
            values.username,
            values.password
        )
        this.loginService.getAdmin(admin)
            .then(
                (data) => {
                    if(data != null) {
                        if(data.status == 200) {
                            localStorage.setItem('token',data.token);
                            this.router.navigate(['/setup']);
                        }else {
                            this.errmsg = data.msg;
                        }
                    }
                }
            )

    }

    ngOnInit(){
        this.initForm();
    }

    private initForm(){
        this.loginForm = new FormGroup({
            username: new FormControl(null, Validators.required),
            password: new FormControl(null, Validators.required)
        })
    }

}