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

@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    ListaModulosComponent,
    PlanosComponent,
    ItemListaComponent,
    MenuLateralComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
