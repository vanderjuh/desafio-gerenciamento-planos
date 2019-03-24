import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { PlanosService } from 'src/app/service/planos.service';

@Component({
  selector: 'app-responsaveis',
  templateUrl: './responsaveis.component.html',
  styleUrls: ['./responsaveis.component.css']
})
export class ResponsaveisComponent implements OnInit {

  displayedColumns: string[] = ['avatar', 'nome', 'email', 'id'];
  dataSource = new MatTableDataSource<any>(this.planosService.getResponsaveis());

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private planosService: PlanosService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.dataSource.paginator = this.paginator;
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
