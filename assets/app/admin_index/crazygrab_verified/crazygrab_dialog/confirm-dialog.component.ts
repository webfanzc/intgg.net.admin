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
        {value: '贴片涉及违法信息', viewValue: 'Steak'},
        {value: '贴片内容不清晰', viewValue: 'Pizza'},
    ];
    stickerForm: FormGroup;
    constructor(@Inject(MAT_DIALOG_DATA) public data: any,public dialogRef: MatDialogRef<ConfirmDialogComponent>) {
        console.log(data);
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


