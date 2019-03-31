import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TiposPlano } from '../core/tipos-plano';
import { PlanosService } from './planos.service';

@Injectable({
  providedIn: 'root'
})
export class TiposPlanoService {

  listaTipos: TiposPlano[];

  constructor(
    private http: HttpClient,
    private planosService: PlanosService
  ) {
    console.log('Serviço "Tipos" ON!');
  }

  getTiposPlano(): Observable<TiposPlano[]> {
    return this.http.get<TiposPlano[]>(`${environment.apiURL}/tipos`);
  }

  deletarTipoPlano(tipo: TiposPlano): Observable<object> {
    if (!this.tipoSendoUsado(tipo)) {
      return this.http.delete(`${environment.apiURL}/tipos/${tipo.id}`);
    } else { throw new Error('Este tipo está sendo utilizado e não pode ser removido!'); }
  }

  salvarTipoPlano(tipoPlano: TiposPlano): Observable<object> {
    if (!tipoPlano.id) {
      return this.http.post(`${environment.apiURL}/tipos`, tipoPlano);
    } else {
      return this.http.put(`${environment.apiURL}/tipos/${tipoPlano.id}`, tipoPlano);
    }
  }

  private tipoSendoUsado(tipo: TiposPlano): boolean | void {
    if (this.planosService.listaPlanos) {
      if (this.planosService.listaPlanos.filter(p => +p.tipo === tipo.id).length > 0) {
        return true;
      }
      return false;
    } else {
      this.planosService.getPlanos().subscribe(planos => {
        this.planosService.listaPlanos = planos;
        this.tipoSendoUsado(tipo);
      });
    }
  }

}
