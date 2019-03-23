import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { PlanosComponent } from './planos/planos.component';
import { VisaoGeralComponent } from './visao-geral/visao-geral.component';

const routes: Routes = [
  { path: 'planos', component: PlanosComponent },
  { path: 'visaogeral', component: VisaoGeralComponent},
  { path: '**', redirectTo: 'planos', pathMatch: 'full' }
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
