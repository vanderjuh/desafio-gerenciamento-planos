import { Injectable } from '@angular/core';
import { Plano } from '../planos/plano';
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

}
