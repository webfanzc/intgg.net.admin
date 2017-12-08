import { NgModule,SkipSelf,Optional } from '@angular/core';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

import { CommonModule } from '@angular/common';import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import {ShareModule} from "../share/share.module";

@NgModule({
  imports: [
    ShareModule,
    BrowserAnimationsModule
  ],
  declarations: [HeaderComponent, FooterComponent, SidebarComponent],
  exports: [
    HeaderComponent, FooterComponent, SidebarComponent
  ]
})
export class CoreModule {

  // @skipself 是表示已加载过了，不要在循环判断了， @optional 表示这个module 是可选的，如果没有正常构造，如果有就抛出异常
  constructor(@Optional() @SkipSelf() parent: CoreModule) {
    if(parent) {
      throw  new Error('模块已经存在，不能再次加载');
    }
  }
}
