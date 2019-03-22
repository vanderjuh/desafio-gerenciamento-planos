import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-modulos',
  templateUrl: './lista-modulos.component.html',
  styleUrls: ['./lista-modulos.component.css']
})
export class ListaModulosComponent implements OnInit {

  responsividade = false;

  constructor() { }

  ngOnInit() {
    this.onResponsividade();
  }

  onResponsividade(): void {
    window.onresize = () => { this.onResize(); };
    window.onload = () => { this.onResize(); };
  }

  private onResize(): void {
    if (window.innerWidth < 700) {
      this.responsividade = true;
    } else { this.responsividade = false; }
  }

}
