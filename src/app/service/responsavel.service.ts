import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Responsavel } from '../planos/responsaveis/responsavel';

@Injectable({
  providedIn: 'root'
})
export class ResponsavelService {

  listaResponsaveis: Responsavel[];

  constructor(private http: HttpClient) {
    console.log('Serviço "Responsavel" ON!');
  }

  getResponsaveis(): Observable<Responsavel[]> {
    return this.http.get<Responsavel[]>(`${environment.apiURL}/responsaveis`);
  }

  deletarResponsavel(id: number): Observable<object> {
    return this.http.delete(`${environment.apiURL}/responsaveis/${id}`);
  }

  salvarResponsavel(responsavel: Responsavel): Observable<object> {
    if (responsavel.id) {
      return this.http.post(`${environment.apiURL}/responsaveis`, responsavel);
    } else {
      return this.http.put(`${environment.apiURL}/responsaveis`, responsavel);
    }
  }

}
