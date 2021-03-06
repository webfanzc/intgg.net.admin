/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {StickerService, StickerSearchParams} from "../sticker.verified.service";
import {Sticker} from "../sticker.verified.model";
import * as util from "../../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../sticker-dialog/confirm-dialog.component";
import {SnackBarService} from "../../../share/toast/snackbar.service";

@Component ({
    selector: 'sticker_reject',
    templateUrl: 'sticker_reject.component.html',
    styleUrls: [
        'sticker_reject.component.css'
    ],

})
export class StickerRejectComponent implements OnInit{

    stickers: Sticker[] = [];


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
        // if(this.reject) {
        //     this.stickerService.getstickers(0,1,30);
        // }else {
            this.stickerService.getstickers(1,1,util.pageSize);
        // }

    }

    stickerVerified(index: number, sticker: Sticker){
        this.sticker = sticker;
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: {sticker: sticker, check: 1}
        });
    }

    stopSticker(sticker: Sticker) {
        sticker.isStart = 0;
       this.stickerService.delSticker(sticker)
           .subscribe(
               (response: any) => {
                   console.log(response);
                   if(response.status == 200 ) {
                        this.snackbar.openSnackBar("停用成功");
                   }
               }
           )
    }
    startSticker(sticker: Sticker) {
        sticker.isStart = 1;
        this.stickerService.updateSticker(sticker)
            .then(
                (response: any) => {
                    if(response != null) {
                        this.snackbar.openSnackBar('启用成功');
                    }
                }
            )
    }
    ngOnInit(){
        this.stickerService.stickersChange
            .subscribe(
                (stickers: Sticker[]) => {
                    this.stickers = stickers
                }
            )
    }


}