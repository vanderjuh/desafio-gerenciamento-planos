import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray, CdkDrag, CdkDropList, transferArrayItem } from '@angular/cdk/drag-drop';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { Responsavel } from '../../core/responsavel';
import { Plano } from '../../core/plano';
import { PlanosService } from 'src/app/service/planos.service';
import { EventosService } from 'src/app/service/eventos.service';
import { Subscription } from 'rxjs';
import { OrdenacaoPlanosService } from 'src/app/service/ordenacao-planos.service';
import { UtilService } from 'src/app/service/util.service';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.css']
})
export class ItemListaComponent implements OnInit, OnDestroy {

  @Input() value: Plano;
  @Input() connectedLists: string[];

  responsavel: Responsavel;

  subPlanos: Plano[];

  dataInicio: Date;
  dataTermino: Date;

  inscriAtualizarLista: Subscription;

  constructor(
    private responsaveisService: ResponsavelService,
    private planosService: PlanosService,
    private eventosService: EventosService,
    private utilService: UtilService
  ) { }

  ngOnInit() {
    this.onGetResponsavel();
    this.getSubplanos();
    this.setPeriodo();
    this.inscricaoAtualizarLista();
  }

  ngOnDestroy() {
    if (this.inscriAtualizarLista) { this.inscriAtualizarLista.unsubscribe(); }
  }

  inscricaoAtualizarLista(): void {
    this.inscriAtualizarLista = this.eventosService.emitirAtualizarListaPlanos.subscribe(() => {
      this.getSubplanos();
    });
  }

  setPeriodo(): void {
    if (this.value.dataInicio) {
      const timestampInicio = Date.parse(this.value.dataInicio);
      this.dataInicio = new Date(timestampInicio);
    }

    if (this.value.dataTermino) {
      const timestampTermino = Date.parse(this.value.dataTermino);
      this.dataTermino = new Date(timestampTermino);
    }
  }

  setSemaforo(): object {
    if (this.dataInicio && this.value.statusAndamento !== 2) {
      if (new Date().getDate() === this.dataInicio.getDate()) { return { borderLeft: 'rgba(255, 166, 0, 0.5) 5px solid' }; }
      if (this.dataInicio > new Date()) { return { borderLeft: 'rgba(0, 128, 0, 0.5) 5px solid' }; }
      if (this.dataInicio < new Date()) { return { borderLeft: 'rgba(255, 0, 0, 0.5) 5px solid' }; }
    }
    return { borderLeft: '#CCC 5px solid' };
  }

  drop(event: CdkDragDrop<string[]>) {
    if (confirm('Deseja realmente mudar o sub-plano de possição?')) {
      if (event.previousContainer === event.container) {
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        this.ordenarSubPlanos();
      } else {
        transferArrayItem(event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex);
        this.editarPertenceSubPlano();
      }
    }
  }

  editarPertenceSubPlano(): void {
    let subPlano: Plano;
    this.subPlanos.forEach(p => {
      if (p !== undefined && p.pertence === null) {
        p.pertence = this.value.id;
        subPlano = p;
      }
    });
    this.eventosService.emitirBarraCarregamento.emit(true);
    this.planosService.salvarPlano(subPlano)
      .subscribe(resp => {
        this.eventosService.emitirBarraCarregamento.emit(true);
        this.ordenarSubPlanos();
      });
  }

  ordenarSubPlanos(): void {
    this.eventosService.emitirBarraCarregamento.emit(true);
    const planoTemp: Plano = { ...this.value, ordemSubPlanos: this.subPlanos.map((p: any) => p.id) };
    this.planosService.salvarPlano(planoTemp)
      .subscribe(resp => {
        this.value = planoTemp;
        this.eventosService.emitirBarraCarregamento.emit(false);
        this.utilService.abrirSnackBar('Lista de sub-planos reordenada com sucesso', 2000);
      });
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

  getSubplanos(): void {
    let subPlanosTemp = this.planosService.listaPlanos.filter(p => p.pertence === this.value.id);
    const listaOrdenada: Plano[] = [];
    this.value.ordemSubPlanos.forEach(
      (ordem: number) => {
        listaOrdenada.push(subPlanosTemp.filter(p => p.id === ordem)[0]);
        subPlanosTemp = subPlanosTemp.filter(p => p.id !== ordem);
      }
    );
    subPlanosTemp.forEach(p => listaOrdenada.push(p));
    this.subPlanos = listaOrdenada;
  }

  onErrorAvatar(avatarImg: any): void {
    avatarImg.src = '../../../assets/img/baseline-account_circle-24px.svg';
  }

  onEditarPlano(): void {
    this.eventosService.emitirEditarPlano.emit(this.value);
  }

  atualizarListaLocal(plano: Plano, remover: boolean = false): void {
    if (remover) {
      this.planosService.listaPlanos = this.planosService.listaPlanos.filter(p => p.id !== plano.id);
    } else {
      this.planosService.listaPlanos = this.planosService.listaPlanos.map(p => {
        if (p.id === +plano.id) { p = { ...plano }; }
        return p;
      });
    }
  }

  onAlterarStatusPlano(status: number): void {
    if (status >= 1 && status <= 4) {
      const plano = this.value;
      plano.statusAndamento = status;
      this.eventosService.emitirBarraCarregamento.emit(true);
      this.planosService.salvarPlano(plano).subscribe(resp => {
        this.atualizarListaLocal(plano);
        this.eventosService.emitirBarraCarregamento.emit(false);
        this.eventosService.emitirAtualizarListaPlanos.emit();
      });
    }
  }

  onRemoverPlano(): void {
    if (confirm('Deseja realmente excluir este plano?')) {
      this.eventosService.emitirBarraCarregamento.emit(true);
      this.planosService.listaPlanos.forEach(p => {
        if (p.id === this.value.id) {
          this.planosService.deletarPlano(p).subscribe(resp => {
            this.atualizarListaLocal(p, true);
            this.eventosService.emitirBarraCarregamento.emit(false);
            this.eventosService.emitirAtualizarListaPlanos.emit();
          });
        }
      });
    }
  }

  onGetResponsavel(): void {
    if (this.responsaveisService.listaResponsaveis !== undefined
      && this.responsaveisService.listaResponsaveis.length > 0) {
      this.responsaveisService.listaResponsaveis.forEach(r => {
        if (r.id === +this.value.responsavel) {
          this.responsavel = r;
          return;
        }
      });
    } else {
      this.responsaveisService.getResponsavel(+this.value.responsavel)
        .subscribe(r => { this.responsavel = r; });
    }
  }

}
