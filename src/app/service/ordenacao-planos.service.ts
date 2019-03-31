import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Plano } from '../core/plano';

@Injectable({
  providedIn: 'root'
})
export class OrdenacaoPlanosService {

  listaOrdenacao: { planos: number[] };

  constructor(
    private http: HttpClient
  ) {
    this.getOrdemPlanos().subscribe(resp => { this.listaOrdenacao = resp; });
    console.log('Serviço "ordenacao" ON');
  }

  getOrdemPlanos(): Observable<{ planos: number[] }> {
    return this.http.get<{ planos: number[] }>(`${environment.apiURL}/ordenacao`);
  }

  ordenarPlanos(ordenacao: { planos: number[] }): Observable<object> {
    return this.http.put(`${environment.apiURL}/ordenacao`, ordenacao);
  }

}
