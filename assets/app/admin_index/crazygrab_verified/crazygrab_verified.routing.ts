                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   /**
/** Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {NgModule} from "@angular/core";
import {CrazygrabRejectComponent} from "./crazygrab_reject/crazygrab_reject.component";
import {CrazygrabResovleComponent} from "./crazygrab_resovle/crazygrab_resovle.component";
import {CrazygrabVerifiedComponent} from "./crazygrab_verified.component";

export const STICKER_ROUTES: Routes = [
    { path: '', component: CrazygrabVerifiedComponent, children: [
        {path:'', redirectTo: 'resovle', pathMatch: 'full'},
        {path: 'reject', component: CrazygrabRejectComponent},
        {path: 'resovle', component: CrazygrabResovleComponent}
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
export class CrazygrabRoutingModule {}