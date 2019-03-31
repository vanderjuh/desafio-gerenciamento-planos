import { Component, OnInit } from '@angular/core';
import { ResponsividadeService } from 'src/app/service/responsividade.service';

@Component({
  selector: 'app-lista-modulos',
  templateUrl: './lista-modulos.component.html',
  styleUrls: ['./lista-modulos.component.css']
})
export class ListaModulosComponent implements OnInit {

  constructor(private responsividadeService: ResponsividadeService) { }

  ngOnInit() {
    this.responsividadeService.onInitResponsividade();
  }

}
