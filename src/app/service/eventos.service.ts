import { Injectable, EventEmitter } from '@angular/core';
import { Plano } from '../planos/plano';

@Injectable({
  providedIn: 'root'
})
export class EventosService {

  emitirEditarPlano = new EventEmitter<Plano>();

  constructor() { }
}