import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { Responsavel } from '../../core/responsavel';
import { Plano } from '../../core/plano';
import { PlanosService } from 'src/app/service/planos.service';
import { EventosService } from 'src/app/service/eventos.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.css']
})
export class ItemListaComponent implements OnInit, OnDestroy {

  @Input() value: Plano;
  responsavel: Responsavel;

  subPlanos: Plano[];

  dataInicio: Date;
  dataTermino: Date;

  inscriAtualizarLista: Subscription;

  constructor(
    private responsaveisService: ResponsavelService,
    private planosService: PlanosService,
    private eventosService: EventosService
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

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.subPlanos, event.previousIndex, event.currentIndex);
  }

  getSubplanos(): void {
    this.subPlanos = this.planosService.listaPlanos.filter(p => p.pertence === this.value.id);
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
