// import {Component,OnInit,Input} from "@angular/core";
// import {Material} from "../material.verified.model";
// import {MaterialService} from "../material.verified.service";
//
// /**
//  * Created by gy104 on 17/5/24.
//  */
//
// @Component({
//     selector: 'materials-page',
//     templateUrl: 'materials-page.component.html',
//     styleUrls : [
//         'materials-page.component.css'
//     ]
// })
//
// export class MaterialsPageComponent implements OnInit{
//
//     @Input() verified : number;
//     pageTotal: number;
//     pageSize = 30; // 每页的数据条数
//     pageCount: number[] = []; //总的页数
//     curpage: number;  //当前的页码数
//     endPageNum: number;
//     constructor(private materialService: MaterialService){}
//
//     getPageData(pageNum: number){
//         this.curpage = pageNum;
//         this.materialService.getMaterials(this.verified,pageNum,this.pageSize)
//             .then(
//                 (res: any) => {
//                     let total = res.total;
//                     let pageCount = res.pageCount;
//                     let page : number[]=[];
//                     console.log(this.pageCount);
//                 }
//             )
//     }
//
//     //首页
//     startPage(){
//         this.materialService.getMaterials(this.verified,this.pageSize)
//             .then(
//                 (res: any) => {
//                     let total = res.total;
//                     let pageCount = res.pageCount;
//                     this.curpage = 1;
//                     this.initPage(this.curpage,pageCount);
//                 }
//             )
//     }
//
//     // 上一页
//
//     beforePage(){
//         let curpage = this.curpage;
//         this.materialService.getMaterials(this.verified,this.curpage-1,this.pageSize)
//             .then(
//                 (res: any) => {
//                     let total = res.total;
//                     let pageCount = res.pageCount;
//                     this.curpage = curpage - 1;
//                     this.initPage(this.curpage,res.pageCount);
//                     console.log(this.pageCount);
//                 }
//             )
//     }
//     nextPage(){
//         let curpage = this.curpage;
//         this.materialService.getMaterials(this.verified,this.curpage+1,this.pageSize)
//             .then(
//                 (res: any) => {
//
//                     let total = res.total;
//                     let pageCount = res.pageCount;
//                     this.curpage = curpage+1;
//                     this.initPage(this.curpage,res.pageCount);
//                     console.log(this.pageCount);
//
//                 }
//             )
//     }
//     endPage(){
//         this.materialService.getMaterials(this.verified,this.curpage+1,this.pageSize)
//             .then(
//                 (res: any) => {
//
//                     let total = res.total;
//                     let pageCount = res.pageCount;
//                     let page : number[]=[];
//
//
//                     this.curpage = this.endPageNum;
//                     this.initPage(this.curpage,res.pageCount);
//                     console.log(this.pageCount);
//
//                 }
//             )
//     }
//
//     // 计算页码
//
//     initPage(curpage: number,total: number) {
//         this.pageCount= [];
//         if( total> 10 && curpage < 10 ) {
//             for(let i=0;i<10;i++) {
//                 this.pageCount.push(
//                     i+1
//                 )
//             }
//         }
//         if(total>10 && curpage >= 10 ){
//             let poor = total - 9;
//             for(let i=0;i<10;i++){
//                 this.pageCount.push(
//                     i+poor
//                 )
//
//             }
//         }
//         if(total < 10){
//             for(let i=0;i<total;i++) {
//                 this.pageCount.push(
//                     i+1
//                 )
//             }
//         }
//     }
//
//     ngOnInit(){
//         // this.materialService.getMaterials(0)
//         //     .then(
//         //         (res: any) => {
//         //             this.pageCount.splice(this.pageCount.length);
//         //             let total = res.total;
//         //             let pageCount = res.pageCount;
//         //             this.endPageNum = pageCount;
//         //             this.initPage(1,res.pageCount);
//         //             this.pageTotal = pageCount;
//         //             this.curpage = 1;
//         //         }
//         //     )
//         this.materialService.materiasPage
//             .subscribe(
//                 (res: any) => {
//                     this.pageCount.splice(this.pageCount.length);
//                     let total = res.total;
//                     let pageCount = res.pageCount;
//                     this.endPageNum = pageCount;
//                     this.initPage(1,res.pageCount);
//                     this.pageTotal = pageCount;
//                     this.curpage = 1;
//                 }
//             )
//     }
// }