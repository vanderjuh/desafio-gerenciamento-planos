import { Injectable, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Plano } from '../planos/plano';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TesteService {

  listaPlanos: Plano[];

  constructor(private http: HttpClient) {
    console.log('Serviço "Teste" ON!');
  }

  getPlanos(): Observable<Plano[]> {
    return this.http.get<Plano[]>(`${environment.apiURL}/testeplanos`);
  }

}
