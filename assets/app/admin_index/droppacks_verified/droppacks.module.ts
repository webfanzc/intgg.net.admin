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
import {DroppackService} from "./droppacks.service";
import {DroppackRejectComponent} from "./droppack_reject/droppacks_reject.component";
import {DroppackResovleComponent} from "./droppack_resovle/droppacks_resovle.component";
@NgModule({
    declarations: [
        DroppackVerifiedComponent,
        DroppacksPageComponent,
        DroppackRejectComponent,
        DroppackResovleComponent,
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
    ],
    providers: [
        DroppackService
    ]
})
export class DroppacksModule{}