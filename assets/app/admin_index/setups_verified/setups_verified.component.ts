/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {SetupsVerifiedService} from "./setups_verifide.service";
import {Setups} from "./setups.model";
import * as util from '../../util'
import {FormGroup, FormControl} from "@angular/forms";
@Component ({
    selector: 'setups_verified',
    templateUrl: './setups_verified.component.html',
    styleUrls: [
        './setups_verified.component.css'
    ],
    providers: [
        SetupsVerifiedService
    ]

})
export class SetupsVerifiedComponent implements OnInit{
    setups: Setups[] = [];
    setup: Setups;
    setupIndex: number;
    setupForm: FormGroup;
    path: string = util.path;

    reject: boolean = true;
    constructor(private setupsService: SetupsVerifiedService){
        this.setupsService.getSetups();
    }

    resovle(index: number,setup: Setups) {
        this.setup = setup;
        this.setupIndex = index;
    }

    resovleSetup() {
        let date = new Date(this.setup.createTime);
        date.setFullYear(date.getFullYear() + 1);
        this.setup.verified = 1;
        this.setup.verifiedMsg = '您提交的信息已通过审核';
        this.setup.expireTime = date.getTime();
        this.setupsService.updateSetup(this.setupIndex,this.setup);

    }


    rejectSetup() {
        this.setup.verified = 2;
        let value = this.setupForm.value;
        if(value.writeInfo == null) {
            this.setup.verifiedMsg = value.selectInfo;

        }else {
            this.setup.verifiedMsg = value.writeInfo;
        }
        this.setup.expireTime = 0;
        this.setupsService.updateSetup(this.setupIndex,this.setup);

    }

    selectResolve(){
        this.reject = true;
    }
    selectReject() {
        this.reject = false

    }

    ngOnInit(){
        this.setupsService.setupsSuject
            .subscribe(
                (setups:Setups[]) =>{
                    this.setups = setups;
                }
            )
        this.initForm();
    }

    private initForm(){
        this.setupForm = new FormGroup({
            selectInfo: new FormControl(),
            writeInfo: new FormControl()
        })
    }
}