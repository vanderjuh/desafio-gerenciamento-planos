import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ResponsavelService } from '../service/responsavel.service';
import { Responsavel } from '../core/responsavel';
import { PlanosService } from '../service/planos.service';
import { OrdenacaoPlanosService } from '../service/ordenacao-planos.service';
import { ResponsividadeService } from '../service/responsividade.service';

@Component({
  selector: 'app-visao-geral',
  templateUrl: './visao-geral.component.html',
  styleUrls: ['./visao-geral.component.css']
})
export class VisaoGeralComponent implements OnInit {

  statusBarraCarregamento: boolean;

  listaQtdPlanosPorStatus: object;

  displayedColumns: string[] = ['avatar', 'responsaveis', 'andamento', 'concluidos', 'suspensos', 'cancelados'];
  dataSource: MatTableDataSource<Responsavel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private ordenacaoPlanosService: OrdenacaoPlanosService,
    private responsavelService: ResponsavelService,
    private planosService: PlanosService,
    private responsividadeService: ResponsividadeService
  ) { }

  ngOnInit() {
    this.getPlanosFromServer();
  }

  getPlanosFromServer(): void {
    if (
      this.planosService.listaPlanos === undefined
      || this.planosService.listaPlanos.length === 0
    ) {
      this.toggleBarraCarregamento();
      this.planosService.getPlanos().subscribe(planos => {
        this.planosService.listaPlanos = planos;
        this.setQtdPlanosPorStatus();
        this.toggleBarraCarregamento();
        this.getResponsaveisFromServer();
      });
    } else {
      this.setQtdPlanosPorStatus();
      this.getResponsaveisFromServer();
    }
  }

  getResponsaveisFromServer(): void {
    if (
      this.responsavelService.listaResponsaveis === undefined
      || this.responsavelService.listaResponsaveis.length === 0
    ) {
      this.toggleBarraCarregamento();
      this.responsavelService.getResponsaveis().subscribe(responsaveis => {
        this.responsavelService.listaResponsaveis = responsaveis;
        this.setResponsaveisNaTabela();
        this.toggleBarraCarregamento();
      });
    } else {
      this.setResponsaveisNaTabela();
    }
  }

  setResponsaveisNaTabela(): void {
    const responsaveis: any[] = [];
    this.responsavelService.listaResponsaveis.forEach(
      (r) => {
        responsaveis.push({
          ...r,
          andamento: this.qtdPlanoPorResponsavelFiltro(r.id, 1),
          concluidos: this.qtdPlanoPorResponsavelFiltro(r.id, 2),
          suspensos: this.qtdPlanoPorResponsavelFiltro(r.id, 3),
          cancelados: this.qtdPlanoPorResponsavelFiltro(r.id, 4)
        });
      }
    );
    this.dataSource = new MatTableDataSource<any>(responsaveis);
    this.dataSource.paginator = this.paginator;
  }

  qtdPlanoPorResponsavelFiltro(idResponsavel: number, filtro: number): number {
    if (this.planosService.listaPlanos) {
      switch (filtro) {
        case 1:
          return this.planosService.listaPlanos
            .filter(
              (p) =>
                +p.responsavel === idResponsavel
                && (p.statusAndamento === null || p.statusAndamento === 1)
            ).length;
        case 2:
          return this.planosService.listaPlanos
            .filter(p => +p.responsavel === idResponsavel && p.statusAndamento === 2).length;
        case 3:
          return this.planosService.listaPlanos
            .filter(p => +p.responsavel === idResponsavel && p.statusAndamento === 3).length;
        case 4:
          return this.planosService.listaPlanos
            .filter(p => +p.responsavel === idResponsavel && p.statusAndamento === 4).length;
      }
    }
  }

  setQtdPlanosPorStatus(): void {
    this.listaQtdPlanosPorStatus = {
      andamento: this.qtdPlanoPorStatus(1),
      concluidos: this.qtdPlanoPorStatus(2),
      suspensos: this.qtdPlanoPorStatus(3),
      cancelados: this.qtdPlanoPorStatus(4)
    };
    console.log(this.listaQtdPlanosPorStatus)
  }

  qtdPlanoPorStatus(filtro: number): number {
    if (this.planosService.listaPlanos) {
      switch (filtro) {
        case 1:
          return this.planosService.listaPlanos.filter(p => p.statusAndamento === null || p.statusAndamento === 1).length;
        case 2:
          return this.planosService.listaPlanos
            .filter(p => p.statusAndamento === 2).length;
        case 3:
          return this.planosService.listaPlanos
            .filter(p => p.statusAndamento === 3).length;
        case 4:
          return this.planosService.listaPlanos
            .filter(p => p.statusAndamento === 4).length;
      }
    }
  }

  onErrorAvatar(avatarImg: any): void {
    avatarImg.src = '../../../assets/img/baseline-account_circle-24px.svg';
  }

  toggleBarraCarregamento(): void {
    this.statusBarraCarregamento = !this.statusBarraCarregamento;
  }

}
