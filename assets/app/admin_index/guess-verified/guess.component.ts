import {Component, OnInit} from '@angular/core';
import {Guess, GuessService} from "./guess.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from '@angular/material';
import {GuessDialogComponent} from "./guess-dialog/guess-dialog.component";
import {SnackBarService} from "../../share/toast/snackbar.service";
import {FormControl} from "@angular/forms";

@Component({
    selector: 'app-guess-verified',
    templateUrl: './guess.component.html',
    styleUrls: ['guess.component.css'],
    providers: [GuessService]
})
export class GuessComponent implements OnInit {
    // guesses: Guess[] = [];
    curGuessTypes: string[] = ['双色球', '大乐透'];
    guesstimeline: any[] = [
        {title: '由近到远', type: 0},
        {title: '由远到近', type: 1}
    ]
    curType: string = 'lottery';//当前选择的竞猜类型，默认为lottery
    typeFilter: FormControl = new FormControl();
    timeFilter: FormControl = new FormControl();
    type: string;
    timeline: string;
    guesses: Guess[];

    constructor(private router: Router,
                private routerInfo: ActivatedRoute,
                private guessService: GuessService,
                private dialog: MatDialog,
                private snackbar: SnackBarService) {
        this.typeFilter.valueChanges
            .subscribe(key => {
                this.guessService.typeFilter(key, this.curType);
                this.type = key;
            })
        this.timeFilter.valueChanges
            .subscribe(key => {
                this.guessService.timeFilter(key);
                this.timeline = key;
            })

    }

    ngOnInit() {

    }

    setType(type: string) {
        this.curType = type;
        this.timeFilter.reset();
        this.typeFilter.reset();
        if (this.curType === 'lottery') {
            this.guesses = this.guessService.getLotteries();
            this.curGuessTypes = ['双色球', '大乐透'];
        } else {
            this.guesses = this.guessService.getStocks();
            this.curGuessTypes = ['深证指数', '上证指数', '创业指数']
        }
    }

    addNewGuess() {
        let title = this.curType === 'lottery' ? '彩票新建' : '股票新建';
        let types = this.curType === 'lottery' ?
            [{name: '双色球', title: '双色球蓝球单双', type: 'lottery'},
                {name: '大乐透', title: '大乐透蓝球和单双', type: 'lottery'}] :
            [
                {name: '上证指数', title: '上证指数高低', type: 'stock'},
                {name: '上证指数', title: '上证指数涨跌', type: 'stock'},
                {name: '深证指数', title: '深证指数涨跌', type: 'stock'},
                {name: '深证指数', title: '深证指数高低', type: 'stock'},
                {name: '创业指数', title: '创业指数高低', type: 'stock'},
                {name: '创业指数', title: '创业指数涨跌', type: 'stock'}
            ]
        let dialogRef = this.dialog.open(GuessDialogComponent, {
            data: {dialogTitle: title, types: types, curType: this.curType},
            width: '680px',
        });
        dialogRef.afterClosed()
            .subscribe(
                (result) => {
                    if (result !== 'cancel' && result !== undefined
                    ) {
                        this.guessService
                            .addGuess(result)
                            .then(
                                () => {
                                    this.snackbar
                                        .openSnackBar(
                                            '保存成功'
                                        )
                                }
                            )
                        ;
                    }
                }
            )
    }

}
