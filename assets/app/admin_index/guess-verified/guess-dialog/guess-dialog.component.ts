import {Component, Inject, OnInit} from "@angular/core";
import {MatDialogRef, MAT_DIALOG_DATA} from "@angular/material";
import {FormGroup, FormControl, Validators} from "@angular/forms";
import {Guess, GuessService} from "../guess.service";

@Component({
    selector: 'app-guess-dialog',
    templateUrl: './guess-dialog.component.html',
    styleUrls: ['./guess-dialog.component.css']
})
export class GuessDialogComponent implements OnInit {
    issue: number = null;
    type: string;
    addGuessForm: FormGroup;
    issueVerified: boolean;

    constructor(@Inject(MAT_DIALOG_DATA) public data: any,
                public dialogRef: MatDialogRef<GuessDialogComponent>,
                private service: GuessService) {
    }

    ngOnInit() {
        this.addGuessForm = new FormGroup({
            typeInfo: new FormControl(null, Validators.required),
            issueInfo: new FormControl(null, [Validators.required, Validators.pattern(/^\d{4,}$/)])
        });
    }

    get typeinfo() {
        return this.addGuessForm.get('typeInfo')
    }

    get issueinfo() {
        return this.addGuessForm.get('issueInfo')
    }

    saveGuess() {
        if (this.typeinfo.invalid && (this.typeinfo.dirty || this.typeinfo.touched)) {
            return;
        }
        if (this.issueinfo.invalid) {
            this.issueVerified = true;
            return;
        }
        let value = this.addGuessForm.value;
        let name = '';
        this.data.types.forEach((item: any) => {
            if (item.title === value.typeInfo) {
                name = item.name;
            }
        })
        let newGuess: Guess = new Guess(name, this.data.curType, value.typeInfo, value.issueInfo,new Date().getTime())

        this.dialogRef.close(newGuess);
    }
}
