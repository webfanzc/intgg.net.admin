/**
 * Created by gy104 on 17/11/7.
 */
/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import * as util from "../../../util";
import {FormGroup, FormControl} from "@angular/forms";
import {DroppackService, DroppackSearchParams} from "../droppacks.service";
import {Droppack} from "../droppacks.model";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../droppack-dialog/confirm-dialog.component";

@Component ({
    selector: 'droppack_reject',
    templateUrl: 'droppacks_reject.component.html',
    styleUrls: [
        'droppacks_reject.component.css'
    ],

})
export class DroppackRejectComponent implements OnInit{
    droppacks : Droppack[] = [];
    path: string = util.path;
    verified: number = 0;
    constructor(private droppackService: DroppackService,private dialog: MatDialog){
        this.droppackService.getDroppacks(1,1,util.pageSize);
    }

    droppackVerified(index: number, droppack: Droppack){
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: {droppack:droppack, check: 1},
            width: '680px',
        });
        dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if(result == 'ok') {
                        droppack.verified = 1;
                        droppack.verifiedMsg = '审核通过';
                        this.droppackService.updateDroppack(droppack);
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
                                        this.droppackService.updateDroppack(droppack);
                                    }
                                }
                            )
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