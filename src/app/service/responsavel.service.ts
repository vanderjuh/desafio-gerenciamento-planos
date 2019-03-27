import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Responsavel } from '../core/responsavel';
import { PlanosService } from './planos.service';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  listaResponsaveis: Responsavel[];

  constructor(
    private http: HttpClient,
    private planosService: PlanosService
    ) {
    console.log('Serviço "Responsavel" ON!');
  }

  getResponsavel(id: number): Observable<Responsavel> {
    return this.http.get<Responsavel>(`${environment.apiURL}/responsaveis/${id}`);
  }

  getResponsaveis(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(`${environment.apiURL}/responsaveis`);
  }

  deletarResponsavel(responsavel: Responsavel): Observable<object> {
    if (!this.responsavelSendoUsado(responsavel)) {
      return this.http.delete(`${environment.apiURL}/responsaveis/${responsavel.id}`);
    } else { throw new Error('Esta pessoa não pode ser removida, pois é responsável por algum plano'); }
  }

  salvarResponsavel(responsavel: Responsavel): Observable<object> {
    if (!responsavel.id) {
      return this.http.post(`${environment.apiURL}/responsaveis`, responsavel);
    } else {
      return this.http.put(`${environment.apiURL}/responsaveis/${responsavel.id}`, responsavel);
    }
  }

  private responsavelSendoUsado(responsavel: Responsavel): boolean | void {
    if (this.planosService.listaPlanos) {
      if (this.planosService.listaPlanos.filter(p => +p.responsavel === responsavel.id).length > 0) {
        return true;
      }
      return false;
    } else {
      this.planosService.getPlanos().subscribe(planos => {
        this.planosService.listaPlanos = planos;
        this.responsavelSendoUsado(responsavel);
      });
    }
  }

}
