import {Component, Input, OnInit} from '@angular/core';
import {Guess, GuessService} from "../guess.service";
import {FormControl} from "@angular/forms";
import {SnackBarService} from "../../../share/toast/snackbar.service";

@Component({
    selector: 'app-guess-list',
    templateUrl: './guess-list.component.html',
    styleUrls: ['./guess-list.component.css']
})
export class GuessListComponent implements  OnInit {

    @Input() curType: string;
    @Input() timeline: string;
    @Input() filterType: string;
    @Input() guesses: Guess[]
    editResult: FormControl = new FormControl();
    result: string;

    constructor(private service: GuessService,
                private snackbar:SnackBarService) {
        this.editResult.valueChanges
            .subscribe(key => {
                this.result = key;
            });
        setTimeout(() => {
        }, 2000);
    }

    ngOnInit() {
        this.service.guessChange
            .subscribe((guesses: Guess[]) => {
                this.guesses = guesses;
            })
        this.guesses = this.curType === 'lottery' ? this.service.getLotteries() : this.service.getStocks();
    }


    delGuess(index: number) {
        this.service.delGuess(this.guesses[index]);
    }

    setResult(index: number) {
        this.service.setResult(this.result, index)
            .then(()=>{
                this.snackbar.openSnackBar('结果保存成功！')
            })
        this.editResult.reset();
    }
}
