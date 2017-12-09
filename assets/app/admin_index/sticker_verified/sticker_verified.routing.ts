                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   /**
/** Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {StickerVerifiedComponent} from "./sticker_verified.component";
import {NgModule} from "@angular/core";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   import {StickerRejectComponent} from "./sticker-reject/sticker_reject.component";
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   import {StickerResovleComponent} from "./sticker-resovle/sticker_resovle.component";

export const STICKER_ROUTES: Routes = [
    { path: '', component: StickerVerifiedComponent, children: [
        {path:'', redirectTo: 'resovle', pathMatch: 'full'},
        {path: 'reject', component: StickerRejectComponent},
        {path: 'resovle', component: StickerResovleComponent}
    ]},
];

@NgModule({
    imports: [
        RouterModule.forChild(STICKER_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class StickerRoutingModule {}