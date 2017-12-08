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
    MatSelectModule
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
    MatSelectModule
  ],
  declarations: []
})
export class ShareModule { }
