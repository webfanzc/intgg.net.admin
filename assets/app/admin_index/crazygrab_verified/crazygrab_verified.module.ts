/**
 * Created by gy104 on 17/9/28.
 */
import {NgModule} from "@angular/core";

import {FormsModule, ReactiveFormsModule} from "@angular/forms";

// import {FilterPipe} from "../filter.pipe";
import {HttpClientModule} from "@angular/common/http";
import {ShareModule} from "../../share/share.module";
import {ConfirmDialogComponent} from "./crazygrab_dialog/confirm-dialog.component";
import {SnackBarService} from "../../share/toast/snackbar.service";
import {CrazygrabVerifiedComponent} from "./crazygrab_verified.component";
import {CrazygrabRejectComponent} from "./crazygrab_reject/crazygrab_reject.component";
import {CrazygrabResovleComponent} from "./crazygrab_resovle/crazygrab_resovle.component";
import {CrazygrabService} from "./crazygrab_verified.service";
import {CrazygrabRoutingModule} from "./crazygrab_verified.routing";
import {CrazygrabPageComponent} from "./crazygrab_page/crazygrab_page.component";
@NgModule({
    declarations: [
        CrazygrabVerifiedComponent,
        CrazygrabRejectComponent,
        CrazygrabResovleComponent,
        ConfirmDialogComponent,
        CrazygrabPageComponent
        // FilterPipe
    ],
    imports:  [
        ShareModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        CrazygrabRoutingModule
    ],
    entryComponents: [
        ConfirmDialogComponent,
    ],
    providers: [
        SnackBarService,
        CrazygrabService
    ]
})
export class CrazygrabsModule{}