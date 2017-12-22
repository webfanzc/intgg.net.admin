/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";

import * as util from "../../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../crazygrab_dialog/confirm-dialog.component";
import {SnackBarService} from "../../../share/toast/snackbar.service";
import {CrazygrabService} from "../crazygrab_verified.service";
import {Crazygrab} from "../crazygrab_verified.model";

@Component ({
    selector: 'crazygrab_reject',
    templateUrl: 'crazygrab_reject.component.html',
    styleUrls: [
        'crazygrab_reject.component.css'
    ],
})
export class CrazygrabRejectComponent implements OnInit{
    //
    crazygrabs: Crazygrab[] = [];
    //
    //
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
        // if(this.reject) {
        //     this.stickerService.getstickers(0,1,30);
        // }else {
        this.crazygrabService.getCrazygrabs(1,1,util.pageSize);
        // }

    }
    //
    stickerVerified(index: number, crazygrab: Crazygrab){
        this.crazygrab = crazygrab;
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: {crazygrab: crazygrab, check: 1}
        });
    }
    //
    // stopSticker(sticker: Sticker) {
    //     sticker.isStart = 0;
    //    this.stickerService.delSticker(sticker)
    //        .subscribe(
    //            (response: any) => {
    //                console.log(response);
    //                if(response.status == 200 ) {
    //                     this.snackbar.openSnackBar("停用成功");
    //                }
    //            }
    //        )
    // }
    // startSticker(sticker: Sticker) {
    //     sticker.isStart = 1;
    //     this.stickerService.updateSticker(sticker)
    //         .then(
    //             (response: any) => {
    //                 if(response != null) {
    //                     this.snackbar.openSnackBar('启用成功');
    //                 }
    //             }
    //         )
    // }
    ngOnInit(){
        this.crazygrabService.stickersChange
            .subscribe(
                (crazygrabs: Crazygrab[]) => {
                    this.crazygrabs = crazygrabs
                }
            )
    }


}