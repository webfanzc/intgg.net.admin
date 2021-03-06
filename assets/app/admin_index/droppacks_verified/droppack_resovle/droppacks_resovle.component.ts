/**
 * Created by gy104 on 17/11/7.
 */
/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import * as util from "../../../util"
import {DroppackService, DroppackSearchParams} from "../droppacks.service";
import {Droppack} from "../droppacks.model";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../droppack-dialog/confirm-dialog.component";
import {SnackBarService} from "../../../share/toast/snackbar.service";

@Component ({
    selector: 'droppack_reject',
    templateUrl: 'droppacks_resovle.component.html',
    styleUrls: [
        'droppacks_resovle.component.css'
    ],

})
export class DroppackResovleComponent implements OnInit{
    droppacks : Droppack[] = [];
    path: string = util.path;
    verified: number = 0;

    constructor(private droppackService: DroppackService,private dialog: MatDialog,private snackbar: SnackBarService){
        this.droppackService.getDroppacks(0,1,util.pageSize)
    }

    droppackVerified(index: number, droppack: Droppack){
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: {droppack: droppack, check: 0},
            width: '680px',
        });
        dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if(result == 'ok') {
                        droppack.verified = 1;
                        droppack.verifiedMsg = '审核通过';
                        this.droppackService.updateDroppack(droppack)
                            .then(
                                (droppack: Droppack) => {
                                    this.droppacks.splice(index, 1);
                                    this.snackbar.openSnackBar('审核成功：已通过')
                                }
                            );
                    }else if(result == 'cancel'){
                        let rejectDialog = this.dialog.open(ConfirmDialogComponent,{
                            data: 'cancel'
                        });
                        rejectDialog.afterClosed()
                            .subscribe(
                                (result) => {
                                    if(result != null && result != 'cancel') {
                                       droppack.verifiedMsg = result;
                                       droppack.verified = 2;
                                        this.droppackService.updateDroppack(droppack)
                                            .then(
                                                (droppack: Droppack) => {
                                                    this.droppacks.splice(index, 1);
                                                    this.snackbar.openSnackBar('审核未通过')
                                                }
                                            );
                                    }
                                }
                            )
                    }
                }
            )

    }

    rejectDroppack(index: number, droppack: Droppack) {
        let rejectDialog = this.dialog.open(ConfirmDialogComponent,{
            data: 'cancel'
        });
        rejectDialog.afterClosed()
            .subscribe(
                (result) => {
                    if(result != null && result != 'cancel') {
                        droppack.verifiedMsg = result;
                        droppack.verified = 2;
                        this.droppackService.updateDroppack(droppack)
                            .then(
                                (droppack: Droppack) => {
                                    this.droppacks.splice(index, 1);
                                    this.snackbar.openSnackBar('审核未通过');
                                }
                            );
                    }
                }
            )
    }

    ngOnInit(){
        this.droppackService.droppacksChange
            .subscribe(
                (droppacks: Droppack[]) => {
                    this.droppacks = droppacks;
                }
            )
    }


}