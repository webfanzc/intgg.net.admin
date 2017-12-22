/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import * as util from "../../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "../crazygrab_dialog/confirm-dialog.component";
import {SnackBarService} from "../../../share/toast/snackbar.service";
import {CrazygrabService} from "../crazygrab_verified.service";
import {Crazygrab} from "../crazygrab_verified.model";

@Component ({
    selector: 'crazygrab_resovle',
    templateUrl: 'crazygrab_resovle.component.html',
    styleUrls: [
        'crazygrab_resovle.component.css'
    ],
})
export class CrazygrabResovleComponent implements OnInit{
    crazygrabsResolve: Crazygrab[] = [];
    crazygrabs: Crazygrab[] = [];
    // stickersReject: Sticker[] = [];
    // reject: boolean = true;
    // stickerIndex: number;
    crazygrab: Crazygrab;
    // stickerTotal: string;
    // path: string = util.path;
    // verified: number;
    // stickerForm: FormGroup;
    // searchForm: FormGroup;
    // rejectInfo = [
    //     {value: '贴片涉及违法信息', viewValue: 'Steak'},
    //     {value: '贴片内容不清晰', viewValue: 'Pizza'},
    // ];
    constructor(private crazygrabService: CrazygrabService,private dialog: MatDialog,private snackbar: SnackBarService){
        this.crazygrabService.getCrazygrabs(0,1,util.pageSize);
    }

    stickerVerified(index: number, crazygrab: Crazygrab){
        this.crazygrab = crazygrab;
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: {crazygrab: crazygrab,check: 0}
        });
        dialogRef.afterClosed()
            .subscribe(
                (result:any) => {
                    if(result == 'ok'){
                        crazygrab.verified = 1;
                        crazygrab.verifiedMsg = '审核通过';
                        this.crazygrabService.updateCrazygrab(crazygrab)
                            .then(
                                (crazygrab: Crazygrab) => {
                                    this.crazygrabs.splice(index, 1);
                                    this.snackbar.openSnackBar('审核通过');
                                }
                            );
                    }else if(result == 'cancel'){
                        let rejectDialog = this.dialog.open(ConfirmDialogComponent,{
                            data: 'cancel'
                        });
                        rejectDialog.afterClosed()
                            .subscribe(
                                (result:any) => {
                                    if(result != null && result != 'cancel') {
                                        crazygrab.verified = 2;
                                        crazygrab.verifiedMsg = result;
                                        this.crazygrabService.updateCrazygrab(crazygrab)
                                            .then(
                                                (crazygrab: Crazygrab) => {
                                                    // this.stickerService.delMoney(sticker._id,sticker.intid);
                                                    this.crazygrabs.splice(index,1);
                                                    this.snackbar.openSnackBar('审核未通过');
                                                }
                                            );
                                    }
                                }
                            )
                    }
                }
            );
    }
    //
    rejectVerified(index: number, crazygrab: Crazygrab) {
        let rejectDialog = this.dialog.open(ConfirmDialogComponent,{
            data: 'cancel'
        });
        rejectDialog.afterClosed()
            .subscribe(
                (result:any) => {
                    if(result != null && result != 'cancel') {
                        crazygrab.verified = 2;
                        crazygrab.verifiedMsg = result;
                        this.crazygrabService.updateCrazygrab(crazygrab)
                            .then(
                                (crazygrab: Crazygrab) => {
                                    // this.stickerService.delMoney(sticker._id,sticker.intid);
                                    this.crazygrabs.splice(index,1);
                                    this.snackbar.openSnackBar('审核未通过');
                                }
                            );
                    }
                }
            )
    }

    ngOnInit(){
        this.crazygrabService.stickersChange
            .subscribe(
                (crazygrabs: Crazygrab[]) => {
                    this.crazygrabs = crazygrabs
                }
            )
    }


}