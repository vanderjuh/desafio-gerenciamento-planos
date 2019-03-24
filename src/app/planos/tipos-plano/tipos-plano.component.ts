import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { PlanosService } from 'src/app/service/planos.service';
import { TiposPlanoService } from 'src/app/service/tipos-plano.service';
import { TiposPlano } from './tipos-plano';

@Component({
  selector: 'app-tipos-plano',
  templateUrl: './tipos-plano.component.html',
  styleUrls: ['./tipos-plano.component.css']
})
export class TiposPlanoComponent implements OnInit {

  displayedColumns: string[] = ['desc', 'remover'];
  dataSource: MatTableDataSource<TiposPlano>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private tiposPlanoService: TiposPlanoService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    if (this.tiposPlanoService.listaTipos === undefined || this.tiposPlanoService.listaTipos.length === 0) {
      this.getTiposPlanoFromServer();
    } else { this.setTiposPlanoNaTabela(); }
  }

  setTiposPlanoNaTabela(): void {
    this.dataSource = new MatTableDataSource<TiposPlano>(this.tiposPlanoService.listaTipos);
    this.dataSource.paginator = this.paginator;
  }

  getTiposPlanoFromServer(): void {
    this.tiposPlanoService.getTiposPlano().subscribe(
      tiposPlano => {
        this.tiposPlanoService.listaTipos = tiposPlano;
        this.setTiposPlanoNaTabela();
      }
    );
  }

  removerTipo(id: number): void {
    this.abrirSnackBar(`ID do tipo: ${id}`, 2000);
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  onInserirTipo(): void {
    this.abrirSnackBar(`Tipo cadastrado com sucesso!`, 2000);
  }

}
