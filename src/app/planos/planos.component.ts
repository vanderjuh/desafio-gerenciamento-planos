import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatSnackBar } from '@angular/material';

import { PlanosService } from '../service/planos.service';
import { CriarPlanoComponent } from './criar-plano/criar-plano.component';
import { TiposPlanoComponent } from './tipos-plano/tipos-plano.component';
import { ResponsaveisComponent } from './responsaveis/responsaveis.component';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {

  constructor(
    private planosService: PlanosService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.getPlanosFromServer();
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  getPlanosFromServer(): void {
    if (this.planosService.listaPlanos === undefined || this.planosService.listaPlanos.length === 0) {
      this.planosService.getPlanos().subscribe(planos => this.planosService.listaPlanos = planos);
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.planosService.listaPlanos, event.previousIndex, event.currentIndex);
  }

  abrirCriarPlanoDialog() {
    const dialogRef = this.dialog.open(CriarPlanoComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  abrirTiposPlanoDialog() {
    const dialogRef = this.dialog.open(TiposPlanoComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  abrirResponsaveisDialog(): void {
    const dialogRef = this.dialog.open(ResponsaveisComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
