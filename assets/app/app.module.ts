import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";

import { AppComponent } from "./app.component";
import {AdminIndexComponent} from "./amdin_index/admin_index.component";
import {routing} from "./app.routing";
import {SetupsVerifiedComponent} from "./amdin_index/setups_verified/setups_verified.component";
import {MaterialVerifiedComponent} from "./amdin_index/material_verified/material_verified.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {FilterPipe} from "./amdin_index/filter.pipe";
import {AdminLoginComponent} from "./amdin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
import {MaterialsPageComponent} from "./amdin_index/material_verified/material-page/materials-page.component";


@NgModule({
    declarations: [
        AppComponent,
        AdminIndexComponent,
        SetupsVerifiedComponent,
        MaterialVerifiedComponent,
        MaterialsPageComponent,
        AdminLoginComponent,
        FilterPipe
    ],
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        routing
    ],
    providers:[
      LoginGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}