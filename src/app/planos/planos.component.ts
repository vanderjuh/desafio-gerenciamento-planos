import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material';
import { PlanosService } from '../service/planos.service';
import { CriarPlanoComponent } from './criar-plano/criar-plano.component';
import { TiposPlanoComponent } from './tipos-plano/tipos-plano.component';
import { ResponsaveisComponent } from './responsaveis/responsaveis.component';
import { Plano } from '../core/plano';
import { Subscription } from 'rxjs';
import { EventosService } from '../service/eventos.service';
import { OrdenacaoPlanosService } from '../service/ordenacao-planos.service';
import { UtilService } from '../service/util.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit, OnDestroy {

  statusBarraCarregamento: boolean;
  mesagemErroRequisicao: boolean;

  listaPlanos: Plano[];

  inscriEditarPlanoModal: Subscription;
  inscriBarraCarregamento: Subscription;
  inscriAtualizarLista: Subscription;

  constructor(
    private planosService: PlanosService,
    private dialog: MatDialog,
    private ordenacaoPlanosService: OrdenacaoPlanosService,
    private eventosService: EventosService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.getPlanosFromServer();
    this.listaPlanosFiltrado();
    this.inscricaoEditarPlanoModal();
    this.inscricaoBarraCarregamento();
    this.inscricaoAtualizarLista();
  }

  ngOnDestroy() {
    if (this.inscriEditarPlanoModal) { this.inscriEditarPlanoModal.unsubscribe(); }
    if (this.inscriBarraCarregamento) { this.inscriBarraCarregamento.unsubscribe(); }
    if (this.inscriAtualizarLista) { this.inscriAtualizarLista.unsubscribe(); }
  }

  inscricaoEditarPlanoModal(): void {
    this.inscriEditarPlanoModal = this.eventosService.emitirEditarPlano
      .subscribe((plano: Plano) => this.abrirCriarPlanoDialog(plano));
  }

  inscricaoBarraCarregamento(): void {
    this.inscriBarraCarregamento = this.eventosService.emitirBarraCarregamento
      .subscribe((flag: boolean) => this.statusBarraCarregamento = flag);
  }

  inscricaoAtualizarLista(): void {
    this.inscriAtualizarLista = this.eventosService.emitirAtualizarListaPlanos
      .subscribe(() => this.listaPlanosFiltrado());
  }

  listaPlanosFiltrado(): void {
    if (this.planosService.listaPlanos) {
      let listaPlanosTemp = this.planosService.listaPlanos.filter(p => p.pertence === null);
      const listaOrdenada: Plano[] = [];
      this.ordenacaoPlanosService.listaOrdenacao.planos.forEach(
        (ordem: number) => {
          listaOrdenada.push(listaPlanosTemp.filter(p => p.id === ordem)[0]);
          listaPlanosTemp = listaPlanosTemp.filter(p => p.id !== ordem);
        }
      );
      listaPlanosTemp.forEach(p => listaOrdenada.push(p));
      this.listaPlanos = listaOrdenada;
    }
  }

  getPlanosFromServer(): void {
    if (
      this.planosService.listaPlanos === undefined
      || this.planosService.listaPlanos.length === 0
    ) {
      this.toggleBarraCarregamento();
      this.planosService.getPlanos().subscribe(
        (planos) => {
          this.planosService.listaPlanos = planos;
          this.listaPlanosFiltrado();
          this.toggleBarraCarregamento();
        },
        this.erroRequisicao.bind(this)
      );
    }
  }

  ordenarPlanos(ordenacao: { planos: number[] }): void {
    this.toggleBarraCarregamento();
    this.ordenacaoPlanosService.ordenarPlanos(ordenacao)
      .subscribe(
        (resp) => {
          this.ordenacaoPlanosService.listaOrdenacao = ordenacao;
          this.toggleBarraCarregamento();
          this.utilService.abrirSnackBar('Lista de planos reordenada com sucesso!', 2000);
        },
        this.erroRequisicao.bind(this)
      );
  }

  erroRequisicao(error: HttpErrorResponse): void {
    this.toggleBarraCarregamento();
    this.mesagemErroRequisicao = true;
    this.utilService.abrirSnackBar('Houve um problema com a conexão!', 5000);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (confirm('Deseja realmente mudar o plano de possível?')) {
      moveItemInArray(this.listaPlanos, event.previousIndex, event.currentIndex);
      this.ordenarPlanos({ planos: this.listaPlanos.map(p => p.id) });
    }
  }

  abrirCriarPlanoDialog(plano: Plano = null) {
    const dialogRef = this.dialog.open(CriarPlanoComponent, { disableClose: true, data: { ...plano } });
    dialogRef.afterClosed().subscribe(result => {
      if (!result) {
        this.toggleBarraCarregamento();
        this.planosService.getPlanos().subscribe(planos => {
          this.planosService.listaPlanos = planos;
          this.listaPlanosFiltrado();
          this.toggleBarraCarregamento();
        });
      } else {
        this.listaPlanosFiltrado();
        this.eventosService.emitirAtualizarListaPlanos.emit();
      }
    });
  }

  abrirTiposPlanoDialog() {
    this.dialog.open(TiposPlanoComponent, { disableClose: true });
  }

  abrirResponsaveisDialog(): void {
    this.dialog.open(ResponsaveisComponent, { disableClose: true });
  }

  toggleBarraCarregamento(): void {
    this.statusBarraCarregamento = !this.statusBarraCarregamento;
  }

}
