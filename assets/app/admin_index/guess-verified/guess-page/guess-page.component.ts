import {Component,OnInit,Input} from "@angular/core";
import {GuessService} from "../guess.service";

/**
 * Created by gy104 on 17/5/24.
 */

@Component({
    selector: 'app-guess-page',
    templateUrl: 'guess-page.component.html',
    styleUrls : [
        'guess-page.component.css'
    ]
})

export class GuessPageComponent implements OnInit{

    @Input() verified: number = 0;
    @Input() curType:string = 'lottery';
    pageTotal: number;
    pageCount: number[] = []; //总的页数
    curpage: number;  //当前的页码数
    endPageNum: number;
    constructor(private service: GuessService){}

    getPageData(pageNum: number){
        this.curpage = pageNum;
        this.service.getGuess(this.curType,pageNum)
            .then(
                (res: any) => {
                    let total = res.total;
                    let pageCount = res.pageCount;
                    this.pageTotal = total;
                    let page : number[]=[];
                    this.curpage=pageNum;
                    this.initPage(this.curpage,pageCount);
                }
            )
    }

    //首页
    startPage(){
        this.service.getGuess(this.curType,1)
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
        let curpage = this.curpage;
        this.service.getGuess(this.curType,this.curpage-1)
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
        this.service.getGuess(this.curType,this.curpage+1)
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
        this.service.getGuess(this.curType,this.pageTotal)
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
        this.service.pageChange
            .subscribe(
                (res: any) => {
                    this.pageCount.splice(this.pageCount.length);
                    let total = res.total;
                    let pageCount = res.pageCount;
                    this.endPageNum = pageCount;
                    this.initPage(1,res.pageCount);
                    this.pageTotal = total;
                    this.curpage = 1;
                }
            )
    }
}




// this.stickerService.getstickers(this.verified,this.curpage-1,this.pageSize)