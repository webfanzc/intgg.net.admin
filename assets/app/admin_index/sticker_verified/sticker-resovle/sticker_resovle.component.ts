/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {StickerService, StickerSearchParams} from "../sticker.verified.service";
import {Sticker} from "../sticker.verified.model";
import * as util from "../../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {MatDialog, MatSidenav} from "@angular/material";
import {ConfirmDialogComponent} from "../sticker-dialog/confirm-dialog.component";
import {SnackBarService} from "../../../share/toast/snackbar.service";

@Component ({
    selector: 'sticker_resovle',
    templateUrl: 'sticker_resovle.component.html',
    styleUrls: [
        'sticker_resovle.component.css'
    ],
})
export class StickerResovleComponent implements OnInit{
    stickersResolve: Sticker[] = [];
    stickers: Sticker[] = [];
    stickersReject: Sticker[] = [];
    reject: boolean = true;
    stickerIndex: number;
    sticker: Sticker;
    stickerTotal: string;
    path: string = util.path;
    verified: number;
    stickerForm: FormGroup;
    searchForm: FormGroup;
    rejectInfo = [
        {value: '贴片涉及违法信息', viewValue: 'Steak'},
        {value: '贴片内容不清晰', viewValue: 'Pizza'},
    ];
    constructor(private stickerService: StickerService,private dialog: MatDialog,private snackbar: SnackBarService){
        this.stickerService.getstickers(0,1,util.pageSize);
    }

    stickerVerified(index: number, sticker: Sticker){
        this.sticker = sticker;
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: {sticker: sticker,check: 0}
        });
        dialogRef.afterClosed()
            .subscribe(
                (result:any) => {
                    if(result == 'ok'){
                        sticker.verified = 1;
                        sticker.isStart = 1;
                        sticker.verifiedMsg = '审核通过';
                        this.stickerService.updateSticker(sticker)
                            .then(
                                (sticker: Sticker) => {
                                    this.stickers.splice(index, 1);
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
                                        sticker.verified = 2;
                                        sticker.isStart = 0;
                                        sticker.verifiedMsg = result;
                                        this.stickerService.updateSticker(this.sticker)
                                            .then(
                                                (sticker: Sticker) => {
                                                    this.stickerService.delMoney(sticker._id,sticker.intid);
                                                    this.stickers.splice(index,1);
                                                    this.snackbar.openSnackBar('审核未通过');
                                                }
                                            );
                                    }
                                }
                            )
                    }
                }
            )
        this.stickerTotal = (parseInt(sticker.total)/100).toFixed(2);
    }

    rejectVerified(index: number, sticker: Sticker) {
        let rejectDialog = this.dialog.open(ConfirmDialogComponent,{
            data: 'cancel'
        });
        rejectDialog.afterClosed()
            .subscribe(
                (result:any) => {
                    if(result != null && result != 'cancel') {
                        sticker.verified = 2;
                        sticker.verifiedMsg = result;
                        this.stickerService.updateSticker(sticker)
                            .then(
                                (sticker: Sticker) => {
                                    this.stickerService.delMoney(sticker._id,sticker.intid);
                                    this.stickers.splice(index,1);
                                }
                            );
                    }
                }
            )
    }

    ngOnInit(){
        this.stickerService.stickersChange
            .subscribe(
                (stickers: Sticker[]) => {
                    this.stickersResolve = stickers
                        .filter(
                            (item) => {
                                return item['verified']== 0;
                            }
                        )
                    this.stickers = stickers



                }
            )
    }


}