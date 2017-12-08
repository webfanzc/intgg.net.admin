/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {StickerService, StickerSearchParams} from "./sticker.verified.service";
import {Sticker} from "./sticker.verified.model";
import * as util from "../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "./sticker-dialog/confirm-dialog.component";

@Component ({
    selector: 'sticker_verified',
    templateUrl: 'sticker_verified.component.html',
    styleUrls: [
        'sticker_verified.component.css'
    ],
    providers: [
        StickerService
    ]

})
export class StickerVerifiedComponent implements OnInit{
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
    constructor(private stickerService: StickerService,private dialog: MatDialog){
        if(this.reject) {
            this.stickerService.getstickers(0,1,30);
        }else {
            this.stickerService.getstickers(1,1,30);
        }

    }

    stickerVerified(index: number, sticker: Sticker){
        this.sticker = sticker;
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: sticker
        });
        dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if(result == 'ok'){
                        sticker.verified = 1;
                        sticker.verifiedMsg = '审核通过';
                        this.stickerService.updateSticker(sticker);
                    }else if(result == 'cancel'){
                        let rejectDialog = this.dialog.open(ConfirmDialogComponent,{
                            data: 'cancel'
                        });
                        rejectDialog.afterClosed()
                            .subscribe(
                                (result) => {
                                    if(result != null && result != 'cancel') {
                                        sticker.verified = 2;
                                        sticker.verifiedMsg = result;
                                        this.stickerService.updateSticker(this.sticker)
                                            .then(
                                                (sticker: Sticker) => {
                                                    console.log(sticker);
                                                    this.stickerService.delMoney(sticker._id,sticker.intid);
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



    //搜索sticker

    searchSticker(){
        let value = this.searchForm.value;
        if(this.reject) {
            this.stickerService.searchSticker(0,new StickerSearchParams(value.total*100,value.date));
        }else {
            this.stickerService.searchSticker(1,new StickerSearchParams(value.total*100,value.date));
        }

    }

    selectResolve(){
        this.reject = true;
        this.verified = 0;
        this.stickerService.getstickers(0,1,30);
        // this.stickersResolve = this.stickers
        //     .filter(
        //         (item) => {
        //             let verified = item['verified'];
        //             return verified == 0;
        //
        //         }
        //     );

    }
    selectReject() {
        this.reject = false;
        this.verified = 1;
        this.stickerService.getstickers(1,1,30);

        // this.stickersReject = this.stickers
        //     .filter(
        //         (item) => {
        //             let verified = item['verified'];
        //             return verified != 0;
        //
        //         }
        //     );
    }

    passSticker(sticker: Sticker){
        sticker.verified = 1;
        sticker.verifiedMsg = '审核通过';
        this.stickerService.updateSticker(sticker);

    }

    rejectSticker(){
        let rejectInfo = this.stickerForm.value;
        if(rejectInfo.writeInfo != null) {
            this.sticker.verifiedMsg = rejectInfo.writeInfo;
        }
        if(rejectInfo.selectInfo !== null) {
            this.sticker.verifiedMsg = rejectInfo.selectInfo;
        }
        if(rejectInfo.writeInfo == null && rejectInfo.selectInfo == null) {
            this.sticker.verifiedMsg = '审核不通过'
        }
        this.sticker.verified = 2;
        this.stickerService.updateSticker(this.sticker)
            .then(
                (sticker: Sticker) => {
                    console.log(sticker);
                    this.stickerService.delMoney(sticker._id,sticker.intid);
                }
            );
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
        this.initForm();
    }

    private initForm(){
        this.stickerForm = new FormGroup({
            writeInfo: new FormControl(),
            selectInfo: new FormControl()
        });
        this.searchForm = new FormGroup({
            total: new FormControl(),
            date: new FormControl()
        })
    }
}