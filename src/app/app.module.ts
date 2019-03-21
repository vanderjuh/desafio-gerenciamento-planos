import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { MenuSuperiorComponent } from './menu-superior/menu-superior.component';
import { AngularMaterialModule } from './shared/angular-material.module';
import { ListaModulosComponent } from './menu-superior/lista-modulos/lista-modulos.component';

@NgModule({
  declarations: [
    AppComponent,
    MenuSuperiorComponent,
    ListaModulosComponent
  ],
  imports: [
    BrowserModule,
    AngularMaterialModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
