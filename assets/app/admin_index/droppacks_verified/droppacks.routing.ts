/**
 * Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {NgModule} from "@angular/core";
import {DroppackVerifiedComponent} from "./droppacks.component";
import {path} from "../../util";
import {DroppackRejectComponent} from "./droppack_reject/droppacks_reject.component";
import {DroppackResovleComponent} from "./droppack_resovle/droppacks_resovle.component";

export const DROPPACKS_ROUTES: Routes = [
    { path: '', component: DroppackVerifiedComponent, children: [
        {path: 'reject', component: DroppackRejectComponent},
        {path: 'resovle', component: DroppackResovleComponent}
    ] },
];

@NgModule({
    imports: [
        RouterModule.forChild(DROPPACKS_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class DroppacksRoutingModule {}