/**
 * Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {SetupsVerifiedComponent} from "./setups_verified.component";
import {NgModule} from "@angular/core";


export const SETUPS_ROUTES: Routes = [
    { path: '', component: SetupsVerifiedComponent, children: [
    ] },
];

@NgModule({
    imports: [
        RouterModule.forChild(SETUPS_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class SetupRoutingModule {}