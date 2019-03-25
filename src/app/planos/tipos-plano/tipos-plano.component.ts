import { Component, OnInit, ViewChild, OnDestroy, ElementRef } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSnackBar } from '@angular/material';
import { TiposPlanoService } from 'src/app/service/tipos-plano.service';
import { TiposPlano } from './tipos-plano';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-tipos-plano',
  templateUrl: './tipos-plano.component.html',
  styleUrls: ['./tipos-plano.component.css']
})
export class TiposPlanoComponent implements OnInit, OnDestroy {

  displayedColumns: string[] = ['desc', 'acoes'];
  dataSource: MatTableDataSource<TiposPlano>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  labelCampoNomeTipo = 'Cadastrar novo tipo';
  @ViewChild('btnCriar') btnCriar: ElementRef;
  formulario: FormGroup;

  statusBarraCarregamento: boolean;

  constructor(
    private tiposPlanoService: TiposPlanoService,
    private snackBar: MatSnackBar,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.formReativo();
    if (this.tiposPlanoService.listaTipos === undefined || this.tiposPlanoService.listaTipos.length === 0) {
      this.getTiposPlanoFromServer();
    } else { this.setTiposPlanoNaTabela(); }
  }

  ngOnDestroy() {
    console.log('Componente de tipos destruido!');
  }

  formReativo(): void {
    this.formulario = this.formBuilder.group({
      id: [null],
      desc: [null, [Validators.required]]
    });
  }

  setTiposPlanoNaTabela(): void {
    this.dataSource = new MatTableDataSource<TiposPlano>(this.tiposPlanoService.listaTipos);
    this.dataSource.paginator = this.paginator;
  }

  getTiposPlanoFromServer(): void {
    this.tiposPlanoService.getTiposPlano().subscribe(
      tiposPlano => {
        this.tiposPlanoService.listaTipos = tiposPlano;
        this.setTiposPlanoNaTabela();
      }
    );
  }

  abrirSnackBar(message: string, time: number) {
    this.snackBar.open(message, null, {
      duration: time,
    });
  }

  toggleBloquearFormulario(): void {
    if (this.formulario.enabled) {
      this.formulario.disable();
      this.btnCriar.nativeElement.disabled = true;
    } else {
      this.formulario.enable();
      this.formulario.reset();
      this.btnCriar.nativeElement.disabled = false;
    }
  }

  toggleBarraCarregamento(): void {
    this.statusBarraCarregamento = !this.statusBarraCarregamento;
  }

  atualizarListaLocal(tipo: TiposPlano, remover: boolean = false): void {
    if (remover) {
      this.tiposPlanoService.listaTipos = this.tiposPlanoService.listaTipos.filter(t => t.id !== tipo.id);
      console.log('Teste:', tipo);
      console.log('Teste:', this.tiposPlanoService.listaTipos);
      this.setTiposPlanoNaTabela();
    } else {
      this.tiposPlanoService.listaTipos.forEach(t => {
        if (t.id === tipo.id) {
          t.desc = tipo.desc;
          return;
        }
      });
    }
  }

  onModoEditar(element: TiposPlano): void {
    this.labelCampoNomeTipo = 'Editar tipo selecionado';
    this.formulario.patchValue(element);
  }

  onModoOriginal(): void {
    this.labelCampoNomeTipo = 'Cadastrar novo tipo';
    this.formulario.reset();
  }

  onSalvarTipo(): void {
    if (!this.formulario.get('desc').hasError('required')) {
      this.toggleBloquearFormulario();
      this.toggleBarraCarregamento();
      this.tiposPlanoService.salvarTipoPlano(this.formulario.value)
        .subscribe(resp => {
          this.toggleBarraCarregamento();
          this.toggleBloquearFormulario();
          if (!this.formulario.get('id').value) {
            this.getTiposPlanoFromServer();
          } else { this.atualizarListaLocal(this.formulario.value); }
          this.onModoOriginal();
          this.abrirSnackBar(`Tipo salvo com sucesso!`, 2000);
        });
    } else { this.abrirSnackBar('É necessário informar o nome do tipo!', 3500); }
  }

  onRemoverTipo(tipo: TiposPlano): void {
    if (confirm('Você tem certeza de que deseja remover este tipo de plano?')) {
      this.toggleBarraCarregamento();
      try {
        this.tiposPlanoService.deletarTipoPlano(tipo)
          .subscribe(resp => {
            this.atualizarListaLocal(tipo, true);
            this.abrirSnackBar(`Tipo removido com sucesso!`, 2000);
          });
      } catch (error) {
        this.abrirSnackBar(error.message, 2000);
      }
      this.toggleBarraCarregamento();
    }
  }

}
