/**
 * Created by gy104 on 17/11/16.
 */
import {Injectable} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {SnackBarComponent} from "./snackbar.component";
@Injectable()
export class SnackBarService {
    constructor(public snackBar: MatSnackBar) {}

    openSnackBar(data: any) {
        this.snackBar.openFromComponent(SnackBarComponent, {
            duration: 3000,
            data: data
        });
    }
}