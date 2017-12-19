/**
 * Created by gy104 on 17/8/10.
 */


import {Component, OnInit} from "@angular/core";
import {StickerService} from "./sticker.verified.service";
import {Sticker} from "./sticker.verified.model";
import * as util from "../../util"
import {Router, ActivatedRoute} from "@angular/router";

@Component ({
    selector: 'sticker_verified',
    templateUrl: 'sticker_verified.component.html',
    styleUrls: [
        'sticker_verified.component.css'
    ],

})
export class StickerVerifiedComponent implements OnInit{

    stickers: Sticker[] = [];
    reject: boolean = true;
    sticker: Sticker;
    path: string = util.path;
    verified: number = 0;
    constructor(
        private stickerService: StickerService,
        private router: Router,
        private routeInfo: ActivatedRoute){
    }

    toRouter(routerValue: string, verified: number) {
        this.verified = verified;
        this.router.navigate([routerValue], { relativeTo: this.routeInfo })

    }
    seachStickerByTotal(event: any){
        let value = event.target.value * 100;
        this.stickerService.searchSticker(this.verified,'total',value);
    }

    //搜索sticker
    searchStickerByDate(event: any){
        let value = event.target.value;
        this.stickerService.searchSticker(this.verified,'date',value);
    }
    ngOnInit(){

    }


}