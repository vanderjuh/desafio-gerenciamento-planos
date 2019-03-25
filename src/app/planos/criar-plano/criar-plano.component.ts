import { Component, OnInit } from '@angular/core';
import { ResponsavelService } from 'src/app/service/responsavel.service';
import { TiposPlanoService } from 'src/app/service/tipos-plano.service';
import { PlanosService } from 'src/app/service/planos.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-criar-plano',
  templateUrl: './criar-plano.component.html',
  styleUrls: ['./criar-plano.component.css']
})
export class CriarPlanoComponent implements OnInit {

  minDat: DateConstructor;

  formulario: FormGroup;

  constructor(
    private tiposPlanoService: TiposPlanoService,
    private responsavelService: ResponsavelService,
    private planosService: PlanosService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.getTiposPlanoFromServer();
    this.getResponsaveisFromServer();
    this.getPlanosFromServer();
    this.formReactivo();
  }

  formReactivo(): void {
    this.formulario = this.formBuilder.group({
      id: [null],
      titulo: [null, [Validators.required]],
      tipo: [{ value: null, disabled: true }, [Validators.required]],
      responsavel: [{ value: null, disabled: true }, [Validators.required]],
      dataInicio: [{value: null, disabled: true}],
      dataTermino: [{value: null, disabled: true}],
      pertence: [{value: {}}],
      interessados: [{ value: null, disabled: true }],
      custo: [null],
      descricao: [null]
    });
  }

  criarPlano(): void {
    const plano = {
      ...this.formulario.value,
      dataInicio: this.extrairData(this.formulario.get('dataInicio').value),
      dataTermino: this.extrairData(this.formulario.get('dataTermino').value)
    };
    console.log(plano);
  }

  extrairData(data: any): string {
    const timestamp = Date.parse(data);
    const dia = new Date(timestamp).getDate();
    const mes = new Date(timestamp).getMonth() + 1;
    const ano = new Date(timestamp).getFullYear();
    return `${ano}-${mes}-${dia}`;
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

}
