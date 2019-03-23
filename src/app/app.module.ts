import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { AngularMaterialModule } from './shared/angular-material.module';
import { ListaModulosComponent } from './menu-superior/lista-modulos/lista-modulos.component';
import { PlanosComponent } from './planos/planos.component';
import { AppRoutingModule } from './app-routing.module';
import { ItemListaComponent } from './planos/item-lista/item-lista.component';
import { MenuLateralComponent } from './menu-lateral/menu-lateral.component';
import { VisaoGeralComponent } from './visao-geral/visao-geral.component';
import { FooterComponent } from './footer/footer.component';
import { CriarPlanoComponent } from './planos/criar-plano/criar-plano.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    ListaModulosComponent,
    PlanosComponent,
    ItemListaComponent,
    MenuLateralComponent,
    VisaoGeralComponent,
    FooterComponent,
    CriarPlanoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularMaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    CriarPlanoComponent
  ]
})
export class AppModule { }
