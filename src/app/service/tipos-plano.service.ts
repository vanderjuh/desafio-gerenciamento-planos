import { Injectable } from '@angular/core';
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

  deletarTipoPlano(id: number): Observable<object> {
    return this.http.delete(`${environment.apiURL}/tipos/${id}`);
  }

  salvarTipoPlano(tipoPlano: TiposPlano): Observable<object> {
    if (tipoPlano.id) {
      return this.http.post(`${environment.apiURL}/tipos`, tipoPlano);
    } else {
      return this.http.put(`${environment.apiURL}/tipos`, tipoPlano);
    }
  }

}
