/**
 * Created by gy104 on 17/9/28.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {HttpModule} from "@angular/http";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AdminIndexRoutingModule} from "./amdin_index.routing";
import {AdminIndexComponent} from "./admin_index.component";
import {SetupsVerifiedComponent} from "./setups_verified/setups_verified.component";
import {MaterialVerifiedComponent} from "./material_verified/material_verified.component";
import {MaterialsPageComponent} from "./material_verified/material-page/materials-page.component";
import {StickerVerifiedComponent} from "./sticker_verified/sticker_verified.component";
import {StickerPageComponent} from "./sticker_verified/sticker-page/sticker-page.component";
import {FilterPipe} from "./filter.pipe";
@NgModule({
    declarations: [
        AdminIndexComponent,
        SetupsVerifiedComponent,
        MaterialVerifiedComponent,
        MaterialsPageComponent,
        StickerVerifiedComponent,
        StickerPageComponent,
        FilterPipe
    ],
    imports:  [
        CommonModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AdminIndexRoutingModule,
    ],
})
export class AdminIndexModule{}