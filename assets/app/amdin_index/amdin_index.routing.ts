/**
 * Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {SetupsVerifiedComponent} from "./setups_verified/setups_verified.component";
import {MaterialVerifiedComponent} from "./material_verified/material_verified.component";

export const ADMIN_ROUTES: Routes = [
    { path: '', redirectTo: 'setups', pathMatch: 'full' }, //通过public/test/login.html 扫一扫登录
    { path: 'setups', component: SetupsVerifiedComponent},
    { path: 'material', component: MaterialVerifiedComponent}
];

