import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppComponent} from "./app.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AdminLoginComponent} from "./admin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
import {AppRoutingModule} from "./app.routing";
import {HttpClientModule} from "@angular/common/http";
import {CoreModule} from "./core/core.module";
import {ShareModule} from "./share/share.module";

@NgModule({
    declarations: [
        AppComponent,
        AdminLoginComponent
    ],
    imports: [
        BrowserModule,
        ShareModule,
        CoreModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule
    ],
    providers: [
        LoginGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}