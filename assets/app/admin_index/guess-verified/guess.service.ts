import {Injectable} from '@angular/core';
import {Subject} from "rxjs/Subject";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import 'rxjs/Rx';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/catch';
import * as util from '../../util';

let Mock = require('mockjs');

@Injectable()
export class GuessService {
    guessChange: Subject<Guess[]> = new Subject<Guess[]>();
    pageChange: Subject<any> = new Subject<any>();
    guesses: Guess[] = [];
    lotteries: Guess[] = [];
    stocks: Guess[] = [];
    pushData: Guess[];
    filter: string = null;
    private headers = {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
    }

    constructor(private http: HttpClient) {
        this.getGuess('lottery', 1).then(
            () => {
                this.guesses.reverse();
                this.updateGuess();
                this.pushData = this.lotteries;
                this.guessChange.next(this.pushData);
            }
        );

    }


    updateGuess() {
        this.lotteries = this.guesses.filter((guess: Guess) =>
            guess.guesstype === 'lottery'
        );
        this.stocks = this.guesses.filter((stock: Guess) =>
            stock.guesstype === 'stock'
        )
    }

    getLotteries() {
        this.pushData = this.lotteries;
        return this.pushData;
    }

    getStocks() {
        this.pushData = this.stocks;
        return this.pushData;
    }

    delGuess(guess: Guess) {
        return this.http.post<any>('/delGuess', guess, this.headers)
            .toPromise()
            .then((res) => {
                if (res.status === 200 && res.data) {
                    this.guesses.splice(this.guesses.findIndex(item => item === guess), 1);
                    this.updateGuess();
                    this.typeFilter(this.filter, guess.guesstype);
                    this.guessChange.next(this.pushData);
                }
            })
    }

    addGuess(guess: Guess) {
        return this.http.post<any>('/addGuess', guess, this.headers)
            .toPromise()
            .then((res) => {
                if (res.data && res.status === 200) {
                    guess.guessissue = Number(guess.guessissue);
                    this.guesses.unshift(guess);
                    this.updateGuess();
                    this.pushData = guess.guesstype === 'lottery' ? this.getLotteries() : this.getStocks();
                    this.guessChange.next(this.pushData);
                }
            })
    }

    setResult(value: string, index: number) {
        let guess = this.pushData[index];
        return this.http.post<any>('/setResult', {value: value, guess: guess}, this.headers)
            .toPromise()
            .then((res: any) => {
                if (res.data && res.status === 200) {
                    guess.guessresult = value;
                }
            });
    }

    typeFilter(type: string, curType: string) {
        this.filter = type;
        if (!type) {
            this.filter = null;
            this.pushData = curType === 'lottery' ? this.getLotteries() : this.getStocks();
            this.guessChange.next(this.pushData);
            return;
        }
        if (curType === 'lottery') {
            this.pushData = this.lotteries.filter(item => {
                return item.guessname === type;
            })
            this.updateGuess();
            this.guessChange.next(this.pushData);
        } else {
            this.pushData = this.stocks.filter(item => {
                return item.guessname === type;
            })
            this.updateGuess();
            this.guessChange.next(this.pushData);
        }
    }

    timeFilter(type: string) {
        if (type === '由近到远') {
            this.pushData = this.pushData.sort((a: any, b: any) => {
                return b.createtime - a.createtime;
            })
        } else {
            this.pushData = this.pushData.sort((a: any, b: any) => {
                return a.createtime - b.createtime;

            })
        }
        this.guessChange.next(this.pushData);

    }

    getGuess(type: string, pageNum: number) {
        return this.http.get<any>('/getList')
            .toPromise()
            .then(response => {
                let res = response;
                let guessArr: Guess[] = [];
                if (res.status === 200) {
                    for (let guess of res.data) {
                        guessArr.push(new Guess(
                            guess.guessname,
                            guess.guesstype,
                            guess.guesstitle,
                            guess.guessissue,
                            guess.createtime,
                            guess.guessresult
                        ))
                    }
                }

                this.guesses = guessArr;
                this.updateGuess();
                if (type === 'lottery') {
                    this.getLotteries();
                } else {
                    this.getStocks();
                }
                this.guessChange.next(this.pushData);
                this.pageChange.next(res);
                return res
            })
    }
}

export class Guess {
    guessname: string;//竞猜名称
    guesstype: string;//竞猜类型
    guesstitle: string;//竞猜标题
    guessissue: number;//竞猜期数
    guessresult: string;//竞猜结果
    createtime: number;//创建时间

    constructor(guessname: string,
                guesstype: string,
                guesstitle: string,
                guessissue: number,
                createtime: number,
                guessresult?: string) {
        this.guessname = guessname;
        this.guesstype = guesstype;
        this.guesstitle = guesstitle;
        this.guessissue = guessissue;
        this.guessresult = guessresult;
        this.createtime = createtime;
    }
}

let listArr: Object[] = [];
for (var i = 0; i < 50; i++) {
    listArr.push(Mock.mock({
        'guessname|1': ['双色球', '大乐透'],
        'guesstype': 'lottery',
        'guessissue|2018011100-2818022222': 0,
        'guessresult|1': ['单', '双', null],
        'createtime|1-1000000': 0,
        'guesstitle|1': ['双色球蓝球单双', '大乐透蓝球单双']
    }))
    listArr.push(Mock.mock({
        'guessname|1': ['上证指数', '深证指数','创业指数'],
        'guesstype': 'stock',
        'guessissue|2018011100-2818022222': 0,
        'guessresult|1': ['高', '低', '涨', '跌', null],
        'createtime|1-1000000': 0,
        'guesstitle|1': ['上证指数高低', '上证指数涨跌', '深证指数高低', '深成指数涨跌','创业指数高低','创业指数涨跌']
    }))
}

Mock.mock('/getList', 'get', function (req: any) {
    return {
        status: 200,
        data: listArr,
        total: 15,
        pageCount: 15
    }
})
Mock.mock('/delGuess', 'post', function (req: any) {
    let body = JSON.parse(req.body);
    listArr.splice(listArr.findIndex((item: Guess) => item.guessissue === body.guessissue), 1);
    return {
        status: 200,
        data: true
    }
})
Mock.mock('/addGuess', 'post', (req: any) => {
    let body = JSON.parse(req.body);
    listArr.push(body);
    console.log(listArr.length);
    return {
        status: 200,
        data: true
    }
})
Mock.mock('/setResult', 'post', (req: any) => {
    let body = JSON.parse(req.body);
    listArr.forEach((item: Guess) => {
        if (item.guessissue === body.guess.guessissue) {
            item.guessresult = body.value;
        }
    })
    return {
        status: 200,
        data: true
    }
})
