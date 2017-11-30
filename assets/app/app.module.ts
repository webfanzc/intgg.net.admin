import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";

import { AppComponent } from "./app.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AdminLoginComponent} from "./admin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
import {AppRoutingModule} from "./app.routing";
import {AdminIndexModule} from "./admin_index/admin_index.module";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
    declarations: [
        AppComponent,
        AdminLoginComponent,
    ],
    imports: [
        BrowserModule,
        HttpModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AdminIndexModule
    ],
    providers:[
      LoginGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}