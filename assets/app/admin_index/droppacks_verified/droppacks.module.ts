/**
 * Created by gy104 on 17/9/28.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
// import {FilterPipe} from "../filter.pipe";
import {DroppackVerifiedComponent} from "./droppacks.component";
import {DroppacksPageComponent} from "./droppack-page/droppacks-page.component";
import {HttpClientModule} from "@angular/common/http";
import {DroppacksRoutingModule} from "./droppacks.routing";
import {ShareModule} from "../../share/share.module";
import {ConfirmDialogComponent} from "./droppack-dialog/confirm-dialog.component";
@NgModule({
    declarations: [
        DroppackVerifiedComponent,
        DroppacksPageComponent,
        ConfirmDialogComponent
        // FilterPipe
    ],
    imports:  [
        ShareModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        DroppacksRoutingModule,
    ],
    entryComponents: [
        ConfirmDialogComponent
    ]
})
export class DroppacksModule{}