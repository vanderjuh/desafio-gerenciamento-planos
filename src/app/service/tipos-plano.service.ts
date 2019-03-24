import { Injectable } from '@angular/core';
import { Plano } from '../planos/plano';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { TiposPlano } from '../planos/tipos-plano/tipos-plano';

@Injectable({
  providedIn: 'root'
})
export class TiposPlanoService {

  listaTipos: TiposPlano[];

  constructor(private http: HttpClient) {
    console.log('Serviço "Tipos" ON!');
  }

  getTiposPlano(): Observable<TiposPlano[]> {
    return this.http.get<TiposPlano[]>(`${environment.apiURL}/tipos`);
  }

}
