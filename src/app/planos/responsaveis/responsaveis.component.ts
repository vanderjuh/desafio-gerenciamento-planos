import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar, MatButton } from '@angular/material';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { Responsavel } from './responsavel';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-responsaveis',
  templateUrl: './responsaveis.component.html',
  styleUrls: ['./responsaveis.component.css']
})
export class ResponsaveisComponent implements OnInit {

  labelTabFormulario = 'Cadastrar responsável';
  tabAtual = 0;

  displayedColumns: string[] = ['avatar', 'responsaveis', 'acoes'];
  dataSource: MatTableDataSource<Responsavel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  formulario: FormGroup;
  @ViewChild('btnSalvarResponsavel') btnSalvarResponsavel: MatButton;

  statusBarraCarregamento: boolean;

  constructor(
    private responsavelService: ResponsavelService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formReativo();
    if (this.responsavelService.listaResponsaveis === undefined || this.responsavelService.listaResponsaveis.length === 0) {
      this.getResponsaveisFromServer();
    } else { this.setResponsaveisNaTabela(); }
  }

  formReativo(): void {
    this.formulario = this.formBuilder.group({
      id: [null],
      nome: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      avatar: [null]
    });
  }

  setResponsaveisNaTabela(): void {
    this.dataSource = new MatTableDataSource<Responsavel>(this.responsavelService.listaResponsaveis);
    this.dataSource.paginator = this.paginator;
  }

  getResponsaveisFromServer(): void {
    this.responsavelService.getResponsaveis().subscribe(
      responsaveis => {
        this.responsavelService.listaResponsaveis = responsaveis;
        this.setResponsaveisNaTabela();
      }
    );
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  onSalvarResponsavel(): void {
    if (this.formulario.valid) {
      this.toggleBarraCarregamento();
      this.toggleBloquearFormulario();
      this.responsavelService.salvarResponsavel(this.formulario.value)
        .subscribe(resp => {
          this.toggleBarraCarregamento();
          this.toggleBloquearFormulario();
          if (!this.formulario.get('id').value) {
            this.getResponsaveisFromServer();
          } else { this.atualizarListaLocal(this.formulario.value); }
          this.onModoOriginal();
          this.abrirSnackBar(`Responsável salvo com sucesso!`, 2000);
        });
    } else {
      Object.keys(this.formulario.controls).forEach(c => this.formulario.get(c).markAsTouched());
      this.abrirSnackBar('Existem campos no formulário que requerem atenção!', 3000);
    }
  }

  onRemoverResponsavel(responsavel: Responsavel): void {
    if (confirm('Você tem certeza de que deseja remover esta pessoa?')) {
      try {
        this.toggleBarraCarregamento();
        this.responsavelService.deletarResponsavel(responsavel)
          .subscribe(resp => {
            this.atualizarListaLocal(responsavel, true);
            this.toggleBarraCarregamento();
            this.abrirSnackBar(`Pessoa removida com sucesso!`, 2000);
          });
      } catch (error) {
        this.abrirSnackBar(error.message, 2000);
      }
    }
  }

  toggleBloquearFormulario(): void {
    if (this.formulario.enabled) {
      this.formulario.disable();
      console.log(this.btnSalvarResponsavel);
      this.btnSalvarResponsavel.disabled = true;
    } else {
      this.formulario.enable();
      this.formulario.reset();
      this.btnSalvarResponsavel.disabled = false;
    }
  }

  onModoEditar(element: Responsavel): void {
    this.tabAtual = 0;
    this.labelTabFormulario = 'Editar responsável';
    this.formulario.patchValue(element);
  }

  onModoOriginal(): void {
    this.labelTabFormulario = 'Cadastrar responsável';
    this.formulario.reset();
  }

  toggleBarraCarregamento(): void {
    this.statusBarraCarregamento = !this.statusBarraCarregamento;
  }

  atualizarListaLocal(responsavel: Responsavel, remover: boolean = false): void {
    if (remover) {
      this.responsavelService.listaResponsaveis = this.responsavelService.listaResponsaveis.filter(r => r.id !== responsavel.id);
      console.log('Teste:', responsavel);
      console.log('Teste:', this.responsavelService.listaResponsaveis);
      this.setResponsaveisNaTabela();
    } else {
      this.responsavelService.listaResponsaveis.forEach(r => {
        if (r.id === responsavel.id) {
          r = { ...responsavel };
          return;
        }
      });
    }
  }

  onErrorAvatar(avatarImg: any): void {
    avatarImg.src = '../../../assets/img/baseline-account_circle-24px.svg';
  }

}
