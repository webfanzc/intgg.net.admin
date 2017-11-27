/**
 * Created by gy104 on 17/5/13.
 */
import {Injectable} from "@angular/core";
import {Http,Headers} from "@angular/http"
/**
 * Created by gy104 on 17/3/23.
 */
import { Setups } from './setups.model'
import {MdSnackBar} from "@angular/material";
import {Subject} from "rxjs";
import {Router} from "@angular/router";

@Injectable()
export class SetupsVerifiedService {
    private setups: Setups[] = [];
    public  setupsSuject: Subject<Setups[]> = new Subject<Setups[]>();
    public setupIndex: Subject<number> = new Subject<number>();
    private path = "?token=" + localStorage.getItem('token');
    constructor(private httpService: Http,private router: Router){}



    updateSetup(index: number,setups: Setups){
        let _id = setups._id;
        let body = JSON.stringify(setups);
        const headers = {
            headers:new Headers({'Content-Type': 'application/json'})
        };
        const prepath =  "/setups/save" + this.path+'&_id=' + _id;;

        this.httpService.post(prepath,body, headers)
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
                    let data = res.data;
                    if(res.status == 200) {
                        this.setups[index] = new Setups(
                            data.brand,
                            data.brandlogo,
                            data.idtype,
                            data.comName,
                            data.comCode,
                            data.name,
                            data.phoneNo,
                            data.idNo,
                            data.cardNo,
                            data.isAuth,
                            data.verifiedMsg,
                            data.expireTime,
                            data._id
                        )
                    }
                    if(res.status != 200){
                        console.log(res);
                        // this.snackBar.open(res.msg,'', {
                        //     duration: 3000
                        // })
                        return;
                    }
                }
            )


    }

    getSetup(index: number){
        return this.setups[index];
    }


    goNet(intid: string) {
       // window.location.href = 'http://localhost:3001/dashboard/admin?intid='+intid;

        let path = 'http://dev.intgg.net/dashboard/admin?intid='+intid;
        window.open(path, '_blank');

        // this.httpService.get(path)
        //     .toPromise()
        //     .then()
    }
    getSetups(): Promise<Setups>{
        const repath = '/setups/list'+this.path;

        return this.httpService.get(repath)
            .toPromise()
            .then(
                (response) => {
                    let res = response.json();
                    let setups : Setups[] = [];
                    if(res.status == 200){
                        for(let data of res.data) {
                            setups.push(
                                new Setups(
                                    data.brand,
                                    data.brandlogo,
                                    data.idtype,
                                    data.comName,
                                    data.comCode,
                                    data.name,
                                    data.phoneNo,
                                    data.idNo,
                                    data.cardNo,
                                    data.isAuth,
                                    data.verifiedMsg,
                                    data.expireTime,
                                    data._id,
                                    data.createTime,
                                    data.intid
                                )
                            )
                        }
                        this.setups = setups;
                        this.setupsSuject.next(this.setups);
                        return response.json().data;
                    }
                }
            )
    }
}