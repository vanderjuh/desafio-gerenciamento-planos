import { Component, OnInit, Input, ɵConsole } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { Responsavel } from '../responsaveis/responsavel';
import { Plano } from '../plano';
import { PlanosService } from 'src/app/service/planos.service';
import { EventEmitter } from '@angular/core';
import { EventosService } from 'src/app/service/eventos.service';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.css']
})
export class ItemListaComponent implements OnInit {

  @Input() value: Plano;
  responsavel: Responsavel;

  subPlanos: Plano[];

  listaRemover: Plano[] = [];

  constructor(
    private responsaveisService: ResponsavelService,
    private planosService: PlanosService,
    private eventosService: EventosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.onGetResponsavel();
    this.getSubplanos();
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.subPlanos, event.previousIndex, event.currentIndex);
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
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

  atualizarListaLocal(plano: Plano): void {
    this.planosService.listaPlanos = this.planosService.listaPlanos.filter(p => p.id !== plano.id);
  }

  onRemoverPlano(): void {
    let msg = 'Deseja realmente excluir este plano?';
    this.listaRemover = this.planosService.listaPlanos.filter(p => +p.pertence === this.value.id);
    const qtdSubPlanos = this.listaRemover.length;
    if (qtdSubPlanos > 0) { msg = `Existem ${qtdSubPlanos} sub-plano(s) neste plano. Deseja realmente excluir?`; }
    if (confirm(msg)) {
      this.eventosService.emitirBarraCarregamento.emit(true);
      this.planosService.listaPlanos.forEach(p => {
        if (p.id === this.value.id) {
          this.planosService.deletarPlano(p).subscribe(resp => {
            this.abrirSnackBar(`Evento: "${p.titulo}" removido!`, 2000);
            this.listaRemover = this.listaRemover.filter(pr => pr.id !== p.id);
            this.atualizarListaLocal(p);
            this.verificarStatusProcesso();
          });
        }
        if (p.pertence === this.value.id) {
          this.planosService.deletarPlano(p).subscribe(resp => {
            this.abrirSnackBar(`Sub-evento: "${p.titulo}" removido!`, 2000);
            this.listaRemover = this.listaRemover.filter(pr => pr.id !== p.id);
            this.atualizarListaLocal(p);
            this.verificarStatusProcesso();
          });
        }
      });
    }
  }

  private verificarStatusProcesso(): void {
    if (this.listaRemover.length === 0) {
      this.eventosService.emitirBarraCarregamento.emit(false);
      this.eventosService.emitirAtualizarListaPlanos.emit();
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
