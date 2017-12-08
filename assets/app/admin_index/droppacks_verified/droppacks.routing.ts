/**
 * Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {NgModule} from "@angular/core";
import {DroppackVerifiedComponent} from "./droppacks.component";

export const DROPPACKS_ROUTES: Routes = [
    { path: '', component: DroppackVerifiedComponent, children: [
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