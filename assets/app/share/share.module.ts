import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatInputModule,
  MatListModule,
  MatSlideToggleModule,
  MatTabsModule,
  MatDialogModule,
  MatSelectModule,
  MatSidenavModule,
  MatCardModule} from '@angular/material'
@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule
  ],
  exports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatInputModule,
    MatListModule,
    MatSlideToggleModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    MatSidenavModule
  ],
  declarations: []
})
export class ShareModule { }
