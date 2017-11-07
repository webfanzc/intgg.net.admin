/**
 * Created by gy104 on 17/8/11.
 */
import { Routes, RouterModule } from "@angular/router";
import {SetupsVerifiedComponent} from "./setups_verified/setups_verified.component";
import {MaterialVerifiedComponent} from "./material_verified/material_verified.component";
import {StickerVerifiedComponent} from "./sticker_verified/sticker_verified.component";
import {NgModule} from "@angular/core";
import {AdminIndexComponent} from "./admin_index.component";
import {DroppackVerifiedComponent} from "./droppacks_verified/droppacks.component";

export const ADMIN_ROUTES: Routes = [
    { path: '', component: AdminIndexComponent, children: [
        { path: 'setups', component: SetupsVerifiedComponent},
        { path: 'material', component: MaterialVerifiedComponent},
        { path: 'sticker', component: StickerVerifiedComponent},
        { path: 'droppack', component: DroppackVerifiedComponent}
    ] },
];

@NgModule({
    imports: [
        RouterModule.forChild(ADMIN_ROUTES)
    ],
    exports: [
        RouterModule
    ]
})
export class AdminIndexRoutingModule {}