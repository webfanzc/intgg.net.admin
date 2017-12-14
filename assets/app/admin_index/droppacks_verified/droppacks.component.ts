/**
 * Created by gy104 on 17/11/7.
 */
/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import * as util from "../../util"
import {FormGroup, FormControl} from "@angular/forms";
import {DroppackService, DroppackSearchParams} from "./droppacks.service";
import {Droppack} from "./droppacks.model";
import {MatDialog} from "@angular/material";
import {ConfirmDialogComponent} from "./droppack-dialog/confirm-dialog.component";
import {Router, ActivatedRoute} from "@angular/router";

@Component ({
    selector: 'droppack_veridfied',
    templateUrl: 'droppacks.component.html',
    styleUrls: [
        'droppacks.component.css'
    ],
    providers: [
        DroppackService
    ]

})
export class DroppackVerifiedComponent implements OnInit{
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
    constructor(
        private router: Router,
        private routerInfo: ActivatedRoute,
        private droppackService: DroppackService,
        private dialog: MatDialog){
    }

    searchDroppackName(event: any) {
        let value = event.target.value;
        this.droppackService.searchDroppack(this.verified,'packname',value);
    }
    searchDroppackDate(event: any) {
        let value = event.target.value;
        this.droppackService.searchDroppack(this.verified,'date',value)
    }
    toRouter(routerValue: string, verified: number) {
        this.verified = verified;
        this.router.navigate([routerValue], { relativeTo: this.routerInfo })
    }
    ngOnInit(){

    }

}