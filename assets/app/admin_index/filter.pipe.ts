/**
 * Created by gy104 on 17/8/12.
 */
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filter'
})
export class FilterPipe implements PipeTransform {


    transform(list: any[], filterField: string, keyword: number) {
       if(!filterField){
           return list;
       }


       return list.filter( (item)=> {

           let fileterValue = item[filterField];

           if(keyword == 1) {
               return fileterValue != 0;
           }else if(keyword == 0){
               return fileterValue == keyword;
           }

       })

    }
}