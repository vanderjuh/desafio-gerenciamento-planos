import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatExpansionModule, MatGridListModule, MatIconModule, MatListModule, MatSidenavModule, MatFormFieldModule, MatMenuModule
} from '@angular/material';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  exports: [
    BrowserAnimationsModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatSidenavModule,
    MatCardModule,
    MatButtonModule,
    MatListModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatMenuModule,
    DragDropModule
  ]
})
export class AngularMaterialModule { }
