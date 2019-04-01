import { Component, OnInit, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList, transferArrayItem } from '@angular/cdk/drag-drop';
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

  connectedLists: string[] = ['planosRoot'];

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

  setConnectedLists(): void {
    this.planosService.listaPlanos.forEach(plano => {
      this.connectedLists.push('plano'.concat(plano.id + ''));
    });
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
      if (this.ordenacaoPlanosService.listaOrdenacao) {
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
      } else {
        this.getOrdenacaoFromServer();
      }
    }
  }

  getOrdenacaoFromServer(): void {
    this.toggleBarraCarregamento();
    this.ordenacaoPlanosService.getOrdemPlanos().subscribe(
      (ordem) => {
        this.ordenacaoPlanosService.listaOrdenacao = ordem;
        this.toggleBarraCarregamento();
        this.listaPlanosFiltrado();
      },
      this.erroRequisicao.bind(this)
    );
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
          this.setConnectedLists();
          this.toggleBarraCarregamento();
        },
        this.erroRequisicao.bind(this)
      );
    } else { this.setConnectedLists(); }
  }

  erroRequisicao(error: HttpErrorResponse): void {
    this.toggleBarraCarregamento();
    this.mesagemErroRequisicao = true;
    this.utilService.abrirSnackBar('Houve um problema com a conexão!', 5000);
  }

  drop(event: CdkDragDrop<string[]>) {
    if (confirm('Deseja realmente mudar o plano de possível?')) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.ordenarPlanos();
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.editarPertencePlano();
      }
    }
  }

  editarPertencePlano(): void {
    let plano: Plano;
    this.listaPlanos.forEach(p => {
      if (p !== undefined && p.pertence !== null) {
        p.pertence = null;
        plano = p;
        return;
      }
    });
    this.toggleBarraCarregamento();
    this.planosService.salvarPlano(plano)
      .subscribe(resp => {
        this.toggleBarraCarregamento();
        this.ordenarPlanos();
      });
  }

  ordenarPlanos(): void {
    const ids: number[] = [];
    this.listaPlanos.forEach(p => {
      if (p !== undefined) { ids.push(p.id); }
    });
    this.toggleBarraCarregamento();
    this.ordenacaoPlanosService.ordenarPlanos({ planos: ids })
      .subscribe(
        (resp) => {
          this.ordenacaoPlanosService.listaOrdenacao = { planos: ids };
          this.toggleBarraCarregamento();
          this.utilService.abrirSnackBar('Lista de planos reordenada com sucesso!', 2000);
        },
        this.erroRequisicao.bind(this)
      );
  }

  canDropPredicate(): (drag: CdkDrag<Element>, drop: CdkDropList<Element>) => boolean {
    const me = this;
    return (drag: CdkDrag<Element>, drop: CdkDropList<Element>): boolean => {
      const fromBounds = drag.dropContainer.element.nativeElement.getBoundingClientRect();
      const toBounds = drop.element.nativeElement.getBoundingClientRect();

      if (!me.intersect(fromBounds, toBounds)) {
        return true;
      }

      // This gross but allows us to access a private field for now.
      const pointerPosition: any = drag['_dragRef']['_pointerPositionAtLastDirectionChange'];
      // They Intersect with each other so we need to do some calculations here.
      if (me.insideOf(fromBounds, toBounds)) {
        return !me.pointInsideOf(pointerPosition, fromBounds);
      }

      if (me.insideOf(toBounds, fromBounds) && me.pointInsideOf(pointerPosition, toBounds)) {
        return true;
      }
      return false;
    };
  }

  intersect(r1: DOMRect | ClientRect, r2: DOMRect | ClientRect): boolean {
    return !(r2.left > r1.right ||
      r2.right < r1.left ||
      r2.top > r1.bottom ||
      r2.bottom < r1.top);
  }

  insideOf(innerRect: DOMRect | ClientRect, outerRect: DOMRect | ClientRect): boolean {
    return innerRect.left >= outerRect.left &&
      innerRect.right <= outerRect.right &&
      innerRect.top >= outerRect.top &&
      innerRect.bottom <= outerRect.bottom &&
      !(
        innerRect.left === outerRect.left &&
        innerRect.right === outerRect.right &&
        innerRect.top === outerRect.top &&
        innerRect.bottom === outerRect.bottom
      );
  }

  pointInsideOf(position: any, rect: DOMRect | ClientRect) {
    return position.x >= rect.left &&
      position.x <= rect.right &&
      position.y >= rect.top &&
      position.y <= rect.bottom;
  }

  abrirCriarPlanoDialog(plano: Plano = null) {
    const dialogRef = this.dialog.open(CriarPlanoComponent, { disableClose: true, data: { ...plano } });
    dialogRef.afterClosed().subscribe(result => {
      this.toggleBarraCarregamento();
      if (!result) {
        this.planosService.getPlanos().subscribe(planos => {
          this.planosService.listaPlanos = planos;
          this.listaPlanosFiltrado();
          this.toggleBarraCarregamento();
        });
      } else {
        this.listaPlanosFiltrado();
        this.eventosService.emitirAtualizarListaPlanos.emit();
        this.toggleBarraCarregamento();
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
