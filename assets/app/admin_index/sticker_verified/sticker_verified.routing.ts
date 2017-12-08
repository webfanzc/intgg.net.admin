                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   /**
/** Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {StickerVerifiedComponent} from "./sticker_verified.component";
import {NgModule} from "@angular/core";

export const STICKER_ROUTES: Routes = [
    { path: '', component: StickerVerifiedComponent},
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