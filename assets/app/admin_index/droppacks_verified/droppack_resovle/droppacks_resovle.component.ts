/**
 * Created by gy104 on 17/11/7.
 */
/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import * as util from "../../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {DroppackService, DroppackSearchParams} from "../droppacks.service";
import {Droppack} from "../droppacks.model";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "../droppack-dialog/confirm-dialog.component";

@Component ({
    selector: 'droppack_reject',
    templateUrl: 'droppacks_resovle.component.html',
    styleUrls: [
        'droppacks_resovle.component.css'
    ],

})
export class DroppackResovleComponent implements OnInit{
    droppacks : Droppack[] = [];
    droppackResovle: Droppack[] = [];
    droppackReject: Droppack[] = [];
    droppack: Droppack;
    droppackIndex: number;
    path: string = util.path;
    verified: number = 0;
    reject: boolean = true;
    materialForm: FormGroup;
    searchForm: FormGroup;
    modal: number = 0;
    config: string = "community";
    configInfo: any;
    rejectInfo = [
        {value: '配置内容与推广主题不相符', viewValue: 'Steak'},
        {value: '排版错误', viewValue: 'Pizza'},
    ];
    constructor(private droppackService: DroppackService,private dialog: MatDialog){
        // if(this.reject) {
            this.droppackService.getDroppacks(0,1,30)
        // }else {
        //     this.droppackService.getDroppacks(1,1,30);
        // }
        // this.droppackService.getDroppacks(0);
    }

    droppackVerified(index: number, droppack: Droppack){
        let dialogRef = this.dialog.open(ConfirmDialogComponent,{
            data: droppack,
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
                                                }
                                            );
                                    }
                                }
                            )
                    }
                }
            )
        this.droppack = droppack;
        this.configInfo = droppack.configInfo;
        this.droppackIndex = index;
    }

    selectConfig(configInfo: string) {
        this.config = configInfo;
    }

    // 通过验证
    passDroppack(droppack: Droppack) {
        droppack.verified = 1;
        droppack.verifiedMsg = '审核通过';
        console.log(droppack);
        this.droppackService.updateDroppack(droppack);
        // this.materialService.updateMaterial(material);
    }

    searchMaterial() {
        let data = this.searchForm.value;
        this.droppackService.searchDroppack(new DroppackSearchParams(data.date));
    }
    //
    searchMaterialByName(event: any) {
        let value = event.target.value;
        this.droppackService.searchDroppackByName(event.target.value);
    }
    //
    selectResolve(){
        this.reject = true;
        this.verified = 0;
        this.droppackService.getDroppacks(0,1,30);
    }
    selectReject(event: any) {
        console.log(event);
        this.reject = false;
        this.verified = 1;
        this.droppackService.getDroppacks(1,1,30);

    }

    rejectDroppack(){
        this.droppack.verified = 2;
        let value = this.materialForm.value;
        if(value.writeInfo != null) {
            this.droppack.verifiedMsg = value.writeInfo;
        }
        if(value.selectInfo != null){
            this.droppack.verifiedMsg = value.selectInfo;
        }
        if(value.selectInfo == null && value.writeInfo == null) {
            this.droppack.verifiedMsg = '审核未通过';
        }
        this.droppackService.updateDroppack(this.droppack);

    }
    ngOnInit(){
        this.droppackService.droppacksChange
            .subscribe(
                (droppacks: Droppack[]) => {
                    this.droppacks = droppacks;
                    console.log(this.droppacks);
                    this.droppackResovle = droppacks
                        .filter(
                            (item) => {
                                return item['verified'] == 0;
                            }
                        )
                }
            )
        this.initForm();
    }

    private initForm(){
        this.materialForm = new FormGroup({
            selectInfo: new FormControl(),
            writeInfo: new FormControl()
        })
        this.searchForm = new FormGroup({
            date: new FormControl(),
            type: new FormControl(),
            position: new FormControl()
        })
    }
}