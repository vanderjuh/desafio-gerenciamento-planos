import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { AppModule } from './app.module';

const routes: Routes = [
  // { path: '/', component: AppModule }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes, /*{useHash: true}*/)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
