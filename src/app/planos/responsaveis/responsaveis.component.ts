import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { Responsavel } from './responsavel';

@Component({
  selector: 'app-responsaveis',
  templateUrl: './responsaveis.component.html',
  styleUrls: ['./responsaveis.component.css']
})
export class ResponsaveisComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'nome', 'email', 'id'];
  dataSource: MatTableDataSource<Responsavel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private responsavelService: ResponsavelService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    if (this.responsavelService.listaResponsaveis === undefined || this.responsavelService.listaResponsaveis.length === 0) {
      this.getResponsaveisFromServer();
    } else { this.setTiposPlanoNaTabela(); }
  }

  setTiposPlanoNaTabela(): void {
    this.dataSource = new MatTableDataSource<Responsavel>(this.responsavelService.listaResponsaveis);
    this.dataSource.paginator = this.paginator;
  }

  getResponsaveisFromServer(): void {
    this.responsavelService.getResponsaveis().subscribe(
      responsaveis => {
        this.responsavelService.listaResponsaveis = responsaveis;
        this.setTiposPlanoNaTabela();
      }
    );
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  onRemoverResponsavel(id: number ): void {
    this.abrirSnackBar(`Contato removido: ${id}`, 2000);
  }

}
