import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatSidenavModule} from '@angular/material'
import {HttpModule} from "@angular/http";

import { AppComponent } from "./app.component";
import {ReactiveFormsModule, FormsModule} from "@angular/forms";
import {AdminLoginComponent} from "./admin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
import {AppRoutingModule} from "./app.routing";
// import {AdminIndexModule} from "./admin_index/admin_index.module";
import {HttpClientModule} from "@angular/common/http";
import {CoreModule} from "./core/core.module";
// import {HeaderComponent} from "./core/header/header.component";
// import {SidebarComponent} from "./core/sidebar/sidebar.component";
// import {FooterComponent} from "./core/footer/footer.component";
import {ShareModule} from "./share/share.module";
import {StickersModule} from "./admin_index/sticker_verified/sticker_verified.module";


@NgModule({
    declarations: [
        AppComponent,
        AdminLoginComponent,
    ],
    imports: [
        BrowserModule,
        MatSidenavModule,
        ShareModule,
        CoreModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        StickersModule
    ],
    providers:[
      LoginGuard
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}