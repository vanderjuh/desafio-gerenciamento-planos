import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { PlanosService } from 'src/app/service/planos.service';

@Component({
  selector: 'app-tipos-plano',
  templateUrl: './tipos-plano.component.html',
  styleUrls: ['./tipos-plano.component.css']
})
export class TiposPlanoComponent implements OnInit {

  displayedColumns: string[] = ['nome', 'remover'];
  dataSource = new MatTableDataSource<any>(this.planosService.ELEMENT_DATA);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private planosService: PlanosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
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
