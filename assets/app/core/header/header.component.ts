import {Component, OnInit, Output, EventEmitter} from '@angular/core';
import {Router} from "@angular/router";

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

    @Output() toggle = new EventEmitter<void>();
    @Output() toggleDarkTheme = new EventEmitter<boolean>();

    constructor(private router: Router) {
    }

    ngOnInit() {
    }

    openSidebar() {
        this.toggle.emit();
    }

    onlogout() {
        this.router.navigate(['/admin_login']);
        localStorage.clear();
    }

    isLoginIn() {
        return localStorage.getItem('token') !== null;
    }

    onChange(checked: boolean) {
        console.log(checked);
        this.toggleDarkTheme.emit(checked);
    }
}
