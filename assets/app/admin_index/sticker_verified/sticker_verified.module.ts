/**
 * Created by gy104 on 17/9/28.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StickerVerifiedComponent} from "./sticker_verified.component";
import {StickerPageComponent} from "./sticker-page/sticker-page.component";
// import {FilterPipe} from "../filter.pipe";
import {HttpClientModule} from "@angular/common/http";
import {StickerRoutingModule} from "./sticker_verified.routing";
import {ShareModule} from "../../share/share.module";
import {ConfirmDialogComponent} from "./sticker-dialog/confirm-dialog.component";
@NgModule({
    declarations: [
        StickerVerifiedComponent,
        StickerPageComponent,
        ConfirmDialogComponent,
        // FilterPipe
    ],
    imports:  [
        ShareModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        StickerRoutingModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ]
})
export class StickersModule{}