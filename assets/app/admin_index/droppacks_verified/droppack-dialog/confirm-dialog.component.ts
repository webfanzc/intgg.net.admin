// /**
//  * Created by gy104 on 17/5/4.
//  */
import {Component, Inject, OnInit} from "@angular/core";
import {MatDialogRef,MAT_DIALOG_DATA} from "@angular/material";
import * as util from "../../../util";
import {FormGroup, FormControl} from "@angular/forms";
@Component({
    selector:'dialog-confirm',
    templateUrl:'confirm-dialog.component.html',
    styleUrls:[
        'confirm-dialog.component.css'
    ]
})
export class ConfirmDialogComponent implements OnInit{
    path: string = util.path;
    rejectInfo = [
        {value: '配置内容与推广主题不相符', viewValue: 'Steak'},
        {value: '排版错误', viewValue: 'Pizza'},
    ];
    stickerForm: FormGroup;
    constructor(@Inject(MAT_DIALOG_DATA) public droppack: any,public dialogRef: MatDialogRef<ConfirmDialogComponent>) {
    }

    rejectSticker(){
        let rejectMsg: string;
        let rejectInfo = this.stickerForm.value;
        if(rejectInfo.writeInfo != null) {
            rejectMsg = rejectInfo.writeInfo;
        }
        if(rejectInfo.selectInfo !== null) {
            rejectMsg = rejectInfo.selectInfo;
        }
        if(rejectInfo.writeInfo == null && rejectInfo.selectInfo == null) {
            rejectMsg = '审核不通过'
        }
        this.dialogRef.close(rejectMsg);
    }
    ngOnInit() {
        this.stickerForm = new FormGroup({
            writeInfo: new FormControl(),
            selectInfo: new FormControl()
        });
    }
}


