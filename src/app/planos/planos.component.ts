import { Component, OnInit, AfterViewInit, DoCheck, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog, MatSnackBar } from '@angular/material';

import { PlanosService } from '../service/planos.service';
import { CriarPlanoComponent } from './criar-plano/criar-plano.component';
import { TiposPlanoComponent } from './tipos-plano/tipos-plano.component';
import { ResponsaveisComponent } from './responsaveis/responsaveis.component';
import { Plano } from './plano';
import { Subscription } from 'rxjs';
import { EventosService } from '../service/eventos.service';
import { TesteService } from '../service/teste.service';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit, OnDestroy {

  statusBarraCarregamento: boolean;

  listaPlanos: Plano[];

  inscriEditarPlanoModal: Subscription;
  inscriBarraCarregamento: Subscription;
  inscriAtualizarLista: Subscription;

  constructor(
    private planosService: PlanosService,
    private testeService: TesteService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private eventosService: EventosService
  ) { }

  ngOnInit() {
    this.getPlanosFromServer();
    this.inscricaoEditarPlanoModal();
    this.inscricaoBarraCarregamento();
    this.inscricaoAtualizarLista();
    this.getPlanosFromServerTeste();
  }

  ngOnDestroy() {
    if (this.inscriEditarPlanoModal) { this.inscriEditarPlanoModal.unsubscribe(); }
    if (this.inscriBarraCarregamento) { this.inscriBarraCarregamento.unsubscribe(); }
    if (this.inscriAtualizarLista) { this.inscriAtualizarLista.unsubscribe(); }
  }

  drop2(event: CdkDragDrop<Plano[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }
    console.log(this.testeService.listaPlanos);
  }


  inscricaoEditarPlanoModal(): void {
    this.inscriEditarPlanoModal = this.eventosService.emitirEditarPlano.subscribe(plano => {
      this.abrirCriarPlanoDialog(plano);
    });
  }

  inscricaoBarraCarregamento(): void {
    this.inscriBarraCarregamento = this.eventosService.emitirBarraCarregamento.subscribe((flag: boolean) => {
      this.statusBarraCarregamento = flag;
    });
  }

  inscricaoAtualizarLista(): void {
    this.inscriAtualizarLista = this.eventosService.emitirAtualizarListaPlanos.subscribe(() => {
      this.listaPlanosFiltrado();
    });
  }

  listaPlanosFiltrado(): void {
    this.listaPlanos = this.planosService.listaPlanos.filter(p => p.pertence === null);
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  getPlanosFromServer(force: boolean = false): void {
    if (
      force === true
      || this.planosService.listaPlanos === undefined
      || this.planosService.listaPlanos.length === 0
    ) {
      this.toggleBarraCarregamento();
      this.planosService.getPlanos().subscribe(planos => {
        this.planosService.listaPlanos = planos;
        this.listaPlanosFiltrado();
        this.toggleBarraCarregamento();
      });
    }
  }

  getPlanosFromServerTeste(): void {
    this.testeService.getPlanos().subscribe(planos => {
      this.testeService.listaPlanos = planos;
    });
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.listaPlanos, event.previousIndex, event.currentIndex);
  }

  abrirCriarPlanoDialog(plano: Plano = null) {
    const dialogRef = this.dialog.open(CriarPlanoComponent, {
      disableClose: true,
      data: { ...plano }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.getPlanosFromServer(true);
      } else {
        this.listaPlanosFiltrado();
        this.eventosService.emitirAtualizarListaPlanos.emit();
      }
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

  toggleBarraCarregamento(): void {
    this.statusBarraCarregamento = !this.statusBarraCarregamento;
  }

}
