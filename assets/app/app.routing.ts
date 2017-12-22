import { Routes, RouterModule } from "@angular/router";
// import {ADMIN_ROUTES} from "./admin_index/amdin_index.routing";
import {AdminLoginComponent} from "./admin_login/admin_login.component";
import {LoginGuard} from "./app.guard";
import {NgModule} from "@angular/core";
const APP_ROUTES: Routes = [
    { path: '', redirectTo: 'admin_login', pathMatch: 'full' }, //通过public/test/login.html 扫一扫登录
    // { path: 'stickers', canActivate:[LoginGuard], component:StickerVerifiedComponent},
    // { path: 'admin_index', canActivate:[LoginGuard],loadChildren: './admin_index/admin_index.module#AdminIndexModule'},
    { path: 'stickers', canActivate:[LoginGuard], loadChildren: './admin_index/sticker_verified/sticker_verified.module#StickersModule'},
    { path: 'crazygrab',  loadChildren: './admin_index/crazygrab_verified/crazygrab_verified.module#CrazygrabsModule'},
    { path: 'setup', canActivate:[LoginGuard], loadChildren: './admin_index/setups_verified/setup_verified.module#SetupModule'},
    { path: 'droppack', canActivate:[LoginGuard], loadChildren: './admin_index/droppacks_verified/droppacks.module#DroppacksModule'},
    // { path: 'admin_index', canActivate:[LoginGuard],loadChildren: './admin_index/admin_index.module#AdminIndexModule'},
    { path: 'admin_login', component: AdminLoginComponent}

];

// export const routing = RouterModule.forRoot(APP_ROUTES,{ useHash: true });
@NgModule({
    imports: [
        RouterModule.forRoot(APP_ROUTES)
    ],
    exports:[RouterModule]
})
export class AppRoutingModule {}