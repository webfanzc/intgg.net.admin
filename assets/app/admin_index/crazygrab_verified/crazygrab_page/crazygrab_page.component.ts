import {Component,OnInit,Input} from "@angular/core";
import {CrazygrabService} from "../crazygrab_verified.service";
import * as util from "../../../util"

/**
 * Created by gy104 on 17/5/24.
 */

@Component({
    selector: 'crazygrab_page',
    templateUrl: 'crazygrab_page.component.html',
    styleUrls : [
        'crazygrab_page.component.css'
    ]
})

export class CrazygrabPageComponent implements OnInit{

    @Input() verified: number = 0;
    pageTotal: number;
    pageSize :  number = util.pageSize; // 每页的数据条数
    pageCount: number[] = []; //总的页数
    curpage: number;  //当前的页码数
    endPageNum: number;
    constructor(private crazygrabService: CrazygrabService){}

    getPageData(pageNum: number){
        this.curpage = pageNum;
        this.crazygrabService.getCrazygrabs(this.verified,this.curpage-1,this.pageSize)
            .then(
                (res: any) => {
                    let total = res.total;
                    let pageCount = res.pageCount;
                    let page : number[]=[];
                }
            )
    }

    //首页
    startPage(){
        this.crazygrabService.getCrazygrabs(this.verified,this.curpage-1,this.pageSize)
            .then(
                (res: any) => {

                    let total = res.total;
                    let pageCount = res.pageCount;
                    this.curpage = 1;
                    this.initPage(this.curpage,pageCount);


                }
            )
    }

    // 上一页

    beforePage(){
        console.log(this.curpage);
        let curpage = this.curpage;
        this.crazygrabService.getCrazygrabs(this.verified,this.curpage-1,this.pageSize)
            .then(
                (res: any) => {
                    let total = res.total;
                    let pageCount = res.pageCount;
                    this.curpage = curpage - 1;
                    this.initPage(this.curpage,res.pageCount);
                }
            )
    }
    nextPage(){
        let curpage = this.curpage;
        this.crazygrabService.getCrazygrabs(this.verified,this.curpage+1,this.pageSize)
            .then(
                (res: any) => {

                    let total = res.total;
                    let pageCount = res.pageCount;
                    this.curpage = curpage + 1;
                    this.initPage(this.curpage,res.pageCount);


                }
            )
    }
    endPage(){
        this.crazygrabService.getCrazygrabs(this.verified,this.curpage-1,this.pageSize)
            .then(
                (res: any) => {

                    let total = res.total;
                    let pageCount = res.pageCount;
                    let page : number[]=[];
                    this.curpage = this.endPageNum;
                    this.initPage(this.curpage,res.pageCount);


                }
            )
    }

    // 计算页码

    initPage(curpage: number,total: number) {
        this.pageCount= [];
        if( total> 10 && curpage < 10 ) {
            for(let i=0;i<10;i++) {
                this.pageCount.push(
                    i+1
                )
            }
        }
        if(total>10 && curpage >= 10 ){
            let poor = total - 9;
            for(let i=0;i<10;i++){
                this.pageCount.push(
                    i+poor
                )

            }
        }
        if(total < 10){
            for(let i=0;i<total;i++) {
                this.pageCount.push(
                    i+1
                )
            }
        }
    }

    ngOnInit(){
        // this.stickerService.getstickers(0)
        //     .then(
        //         (res: any) => {
        //             this.pageCount.splice(this.pageCount.length);
        //             let total = res.total;
        //             let pageCount = res.pageCount;
        //             this.endPageNum = pageCount;
        //             this.initPage(1,res.pageCount);
        //             this.pageTotal = pageCount;
        //             this.curpage = 1;
        //         }
        //     )
        this.crazygrabService.stickersPage
            .subscribe(
                (res: any) => {
                    this.pageCount.splice(this.pageCount.length);
                    let total = res.total;
                    let pageCount = res.pageCount;
                    this.endPageNum = pageCount;
                    this.initPage(1,res.pageCount);
                    this.pageTotal = pageCount;
                    this.curpage = 1;
                }
            )
    }
}




// this.stickerService.getstickers(this.verified,this.curpage-1,this.pageSize)