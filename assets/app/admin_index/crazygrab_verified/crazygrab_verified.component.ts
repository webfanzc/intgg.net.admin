/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import * as util from "../../util"
import {Router, ActivatedRoute} from "@angular/router";
import {Crazygrab} from "./crazygrab_verified.model";
import {CrazygrabService} from "./crazygrab_verified.service";

@Component ({
    selector: 'crazygrab_verified',
    templateUrl: 'crazygrab_verified.component.html',
    styleUrls: [
        'crazygrab_verified.component.css'
    ],

})
export class CrazygrabVerifiedComponent implements OnInit{

    crazygrabs: Crazygrab[] = [];
    reject: boolean = true;
    crazygrab: Crazygrab;
    path: string = util.path;
    verified: number = 0;
    constructor(
        private crazygrabService: CrazygrabService,
        private router: Router,
        private routeInfo: ActivatedRoute){
    }

    toRouter(routerValue: string, verified: number) {
        this.verified = verified;
        this.router.navigate([routerValue], { relativeTo: this.routeInfo })

    }
    // seachStickerByTotal(event: any){
    //     let value = event.target.value * 100;
    //     this.stickerService.searchSticker(this.verified,'total',value);
    // }
    //
    // //搜索sticker
    // searchStickerByDate(event: any){
    //     let value = event.target.value;
    //     this.stickerService.searchSticker(this.verified,'date',value);
    // }
    ngOnInit(){

    }


}