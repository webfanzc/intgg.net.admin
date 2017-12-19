/**
 * Created by gy104 on 17/11/16.
 */
import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA} from '@angular/material';

@Component({
    selector: 'your-snack-bar',
    template: '{{ data }}',
})
export class SnackBarComponent {
    constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}