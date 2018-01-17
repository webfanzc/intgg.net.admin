import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {GuessComponent} from "./guess.component";
import {GuessService} from "./guess.service";
import {Routes, RouterModule} from "@angular/router";
import {ShareModule} from "../../share/share.module";
import {HttpClientModule} from "@angular/common/http";
import {SnackBarService} from "../../share/toast/snackbar.service";
import {GuessListComponent} from './guess-list/guess-list.component';
import {GuessDialogComponent} from './guess-dialog/guess-dialog.component';
import {ReactiveFormsModule} from "@angular/forms";
import {TimelinePipe} from "../../pipe/timeFilter.pipe";
import {TypeFilterPipe} from "../../pipe/type-filter.pipe";
import {GuessPageComponent} from "./guess-page/guess-page.component";

const GUESS_ROUTES: Routes = [
    {
        path: '', component: GuessComponent
    },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(GUESS_ROUTES),
        ShareModule,
        HttpClientModule,
        ReactiveFormsModule
    ],
    declarations: [
        GuessComponent,
        GuessListComponent,
        GuessDialogComponent,
        TimelinePipe,
        TypeFilterPipe,
        GuessPageComponent
    ],
    providers: [
        GuessService,
        SnackBarService
    ],
    exports: [
        RouterModule
    ],
    entryComponents: [
        GuessDialogComponent
    ]
})
export class GuessModule {
}
