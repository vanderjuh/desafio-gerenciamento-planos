import { Component, OnInit, Input } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { Responsavel } from '../responsaveis/responsavel';
import { Plano } from '../plano';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';
import { PlanosService } from 'src/app/service/planos.service';

@Component({
  selector: 'app-item-lista',
  templateUrl: './item-lista.component.html',
  styleUrls: ['./item-lista.component.css']
})
export class ItemListaComponent implements OnInit {

  @Input() value: Plano;
  responsavel: Responsavel;

  subPlanos: Plano[];

  constructor(
    private responsaveisService: ResponsavelService,
    private planosService: PlanosService
  ) { }

  ngOnInit() {
    this.onGetResponsavel();
    this.getSubplanos();
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
