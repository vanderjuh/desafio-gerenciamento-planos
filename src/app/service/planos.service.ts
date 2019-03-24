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

  getPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${environment.apiURL}/planos`);
  }

}
