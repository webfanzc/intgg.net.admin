/**
 * Created by gy104 on 17/9/28.
 */
import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {SetupsVerifiedComponent} from "./setups_verified.component";

import {FilterPipe} from "../filter.pipe";
import {HttpClientModule} from "@angular/common/http";
import {SetupRoutingModule} from "./setup_verified.routing";
import {ShareModule} from "../../share/share.module";
import {ConfirmDialogComponent} from "./setup-dialog/confirm-dialog.component";
@NgModule({
    declarations: [
        SetupsVerifiedComponent,
        FilterPipe,
        ConfirmDialogComponent
    ],
    imports:  [
        ShareModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        SetupRoutingModule,
    ],
    entryComponents: [
        ConfirmDialogComponent
    ]
})
export class SetupModule{}