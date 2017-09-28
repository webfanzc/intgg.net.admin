import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {HttpModule} from "@angular/http";

import { AppComponent } from "./app.component";
import {AdminIndexComponent} from "./admin_index/admin_index.component";
import {SetupsVerifiedComponent} from "./admin_index/setups_verified/setups_verified.component";
import {MaterialVerifiedComponent} from "./admin_index/material_verified/material_verified.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {FilterPipe} from "./admin_index/filter.pipe";
import {AdminLoginComponent} from "./admin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
import {MaterialsPageComponent} from "./admin_index/material_verified/material-page/materials-page.component";
import {StickerVerifiedComponent} from "./admin_index/sticker_verified/sticker_verified.component";
import {StickerPageComponent} from "./admin_index/sticker_verified/sticker-page/sticker-page.component";
import {AppRoutingModule} from "./app.routing";
import {AdminIndexModule} from "./admin_index/admin_index.module";


@NgModule({
    declarations: [
        AppComponent,
        AdminLoginComponent,
        // AdminIndexComponent,
        // SetupsVerifiedComponent,
        // MaterialVerifiedComponent,
        // MaterialsPageComponent,
        // StickerVerifiedComponent,
        // StickerPageComponent,
        // FilterPipe
    ],
    imports: [
        BrowserModule,
        HttpModule,
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