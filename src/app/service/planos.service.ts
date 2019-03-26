import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Plano } from '../planos/plano';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlanosService {

  listaPlanos: Plano[];

  constructor(private http: HttpClient) {
    console.log('Serviço "Planos" ON!');
  }

  getPlanosParent(): Plano[] {
    if (this.listaPlanos) {
      return this.listaPlanos.filter(p => p.pertence === null);
    }
  }

  getPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${environment.apiURL}/planos`);
  }

  deletarPlano(plano: Plano): Observable<object> {
    return this.http.delete(`${environment.apiURL}/planos/${plano.id}`);
  }

  salvarPlano(plano: Plano): Observable<object> {
    if (!plano.id) {
      return this.http.post(`${environment.apiURL}/planos`, plano);
    } else {
      return this.http.put(`${environment.apiURL}/planos/${plano.id}`, plano);
    }
  }

}
