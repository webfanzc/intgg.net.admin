/**
 * Created by gy104 on 17/9/28.
 */
import {NgModule} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {StickerVerifiedComponent} from "./sticker_verified.component";
import {StickerPageComponent} from "./sticker-page/sticker-page.component";
// import {FilterPipe} from "../filter.pipe";
import {HttpClientModule} from "@angular/common/http";
import {StickerRoutingModule} from "./sticker_verified.routing";
import {ShareModule} from "../../share/share.module";
import {ConfirmDialogComponent} from "./sticker-dialog/confirm-dialog.component";
import {StickerRejectComponent} from "./sticker-reject/sticker_reject.component";
import {StickerResovleComponent} from "./sticker-resovle/sticker_resovle.component";
import {StickerService} from "./sticker.verified.service";
@NgModule({
    declarations: [
        StickerVerifiedComponent,
        StickerPageComponent,
        ConfirmDialogComponent,
        StickerRejectComponent,
        StickerResovleComponent,
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
    ],
    providers: [
        StickerService
    ]
})
export class StickersModule{}