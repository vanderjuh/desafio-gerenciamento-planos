import { Component, OnInit, ViewChild } from '@angular/core';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { TiposPlanoService } from 'src/app/service/tipos-plano.service';
import { PlanosService } from 'src/app/service/planos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSnackBar, MatButton, MatDialogRef } from '@angular/material';
import { Plano } from '../plano';

@Component({
  selector: 'app-criar-plano',
  templateUrl: './criar-plano.component.html',
  styleUrls: ['./criar-plano.component.css']
})
export class CriarPlanoComponent implements OnInit {

  labelDialogPlano = 'CADASTRAR PLANO';

  minDat: DateConstructor;

  formulario: FormGroup;
  @ViewChild('btnSalvarPlano') btnSalvarPlano: MatButton;

  statusBarraCarregamento: boolean;

  constructor(
    private tiposPlanoService: TiposPlanoService,
    private responsavelService: ResponsavelService,
    private planosService: PlanosService,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CriarPlanoComponent>
  ) { }

  ngOnInit() {
    this.formReactivo();
    this.getTiposPlanoFromServer();
    this.getResponsaveisFromServer();
    this.getPlanosFromServer();
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  formReactivo(): void {
    this.formulario = this.formBuilder.group({
      id: [null],
      titulo: [null, [Validators.required]],
      tipo: [{ value: null, disabled: true }, [Validators.required]],
      responsavel: [{ value: null, disabled: true }, [Validators.required]],
      dataInicio: [{ value: null, disabled: true }],
      dataTermino: [{ value: null, disabled: true }],
      pertence: [{ value: {} }],
      interessados: [{ value: null, disabled: true }],
      custo: [null],
      descricao: [null]
    });
  }

  onSalvarPlano(): void {
    if (this.formulario.valid) {
      if (typeof this.formulario.get('pertence').value === 'object') {
        this.formulario.get('pertence').setValue(null);
      }
      const plano = {
        ...this.formulario.value,
        dataInicio: this.extrairData(this.formulario.get('dataInicio').value),
        dataTermino: this.extrairData(this.formulario.get('dataTermino').value),
        statusAndamento: null
      };
      this.toggleBarraCarregamento();
      this.toggleBloquearFormulario();
      this.planosService.salvarPlano(plano)
        .subscribe(
          resp => {
            this.toggleBarraCarregamento();
            this.toggleBloquearFormulario();
            if (!this.formulario.get('id').value) {
              this.getPlanosFromServer();
            } else { this.atualizarListaLocal(this.formulario.value); }
            this.onModoOriginal();
            this.abrirSnackBar(`Plano salvo com sucesso!`, 2000);
            this.dialogRef.close(true);
          }
        );
    } else {
      Object.keys(this.formulario.controls).forEach(c => this.formulario.get(c).markAsTouched());
      this.abrirSnackBar(`Existem campos que requerem atenção!`, 2000);
    }
  }

  extrairData(data: any): string {
    if (data) {
      const timestamp = Date.parse(data);
      const dia = new Date(timestamp).getDate();
      const mes = new Date(timestamp).getMonth() + 1;
      const ano = new Date(timestamp).getFullYear();
      return `${ano}-${mes}-${dia}`;
    }
    return null;
  }

  getTiposPlanoFromServer(): void {
    this.tiposPlanoService.getTiposPlano().subscribe(
      tiposPlano => {
        this.tiposPlanoService.listaTipos = tiposPlano;
        this.formulario.get('tipo').enable();
      }
    );
  }

  getResponsaveisFromServer(): void {
    this.responsavelService.getResponsaveis().subscribe(
      responsaveis => {
        this.responsavelService.listaResponsaveis = responsaveis;
        this.formulario.get('responsavel').enable();
        this.formulario.get('interessados').enable();
      }
    );
  }

  getPlanosFromServer(): void {
    if (this.planosService.listaPlanos === undefined || this.planosService.listaPlanos.length === 0) {
      this.planosService.getPlanos().subscribe(planos => this.planosService.listaPlanos = planos);
      this.formulario.get('pertence').enable();
    }
  }

  toggleBloquearFormulario(): void {
    if (this.formulario.enabled) {
      this.formulario.disable();
      this.btnSalvarPlano.disabled = true;
    } else {
      this.formulario.enable();
      this.formulario.reset();
      this.btnSalvarPlano.disabled = false;
    }
  }

  toggleBarraCarregamento(): void {
    this.statusBarraCarregamento = !this.statusBarraCarregamento;
  }

  atualizarListaLocal(plano: Plano, remover: boolean = false): void {
    if (remover) {
      this.planosService.listaPlanos = this.planosService.listaPlanos.filter(p => p.id !== plano.id);
      console.log('Teste:', plano);
      console.log('Teste:', this.planosService.listaPlanos);
    } else {
      this.planosService.listaPlanos.forEach(p => {
        if (p.id === plano.id) {
          p = { ...plano };
          return;
        }
      });
    }
  }

  onModoEditar(element: Plano): void {
    this.labelDialogPlano = 'EDITAR PLANO';
    this.formulario.patchValue(element);
  }

  onModoOriginal(): void {
    this.labelDialogPlano = 'CADASTRAR PLANO';
    this.formulario.reset();
  }

}
