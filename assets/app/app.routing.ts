import { Routes, RouterModule } from "@angular/router";
import {AdminIndexComponent} from "./amdin_index/admin_index.component"
import {ADMIN_ROUTES} from "./amdin_index/amdin_index.routing";
import {AdminLoginComponent} from "./amdin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'admin_login', pathMatch: 'full' }, //通过public/test/login.html 扫一扫登录
    { path: 'admin_index', canActivate:[LoginGuard],component: AdminIndexComponent,children: ADMIN_ROUTES},
    { path: 'admin_login', component: AdminLoginComponent}

];

export const routing = RouterModule.forRoot(APP_ROUTES,{ useHash: true });