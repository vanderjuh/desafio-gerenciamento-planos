import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlanosService {

  planos = [
    {
      id: 1,
      titulo: 'Teste automatizado',
      status: 'Andamento',
      prazo: '28/02/2019',
      responsavel: {
        id: 3434,
        nome: 'Vanderley Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
      },
      subPlanos: [
        {
          id: 567567,
          titulo: 'Etapa 1',
          status: 'Aguardando',
          prazo: '28/02/2019',
          responsavel: {
            id: 3434,
            nome: 'Vanderley Sousa da Silva Junior',
            email: 'vanderley@forlogic.net',
            avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
          }
        },
        {
          id: 567567,
          titulo: 'Etapa 2',
          status: 'Aguardando',
          prazo: '28/02/2019',
          responsavel: {
            id: 3434,
            nome: 'Vanderley Sousa da Silva Junior',
            email: 'vanderley@forlogic.net',
            avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
          }
        },
        {
          id: 567567,
          titulo: 'Etapa 3',
          status: 'Aguardando',
          prazo: '28/02/2019',
          responsavel: {
            id: 3434,
            nome: 'Vanderley Sousa da Silva Junior',
            email: 'vanderley@forlogic.net',
            avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
          }
        }
      ]
    },
    {
      id: 2,
      titulo: 'Mudança de UX para Angular',
      status: 'Atrasado',
      prazo: '01/11/2018',
      responsavel: {
        id: 3434,
        nome: 'Vanderley Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
      }
    },
    {
      id: 3,
      titulo: 'Compras de equipamentos',
      status: 'Concluido',
      prazo: '10/05/2017',
      responsavel: {
        id: 3434,
        nome: 'Vanderley Sousa da Silva Junior',
        email: 'vanderley@forlogic.net',
        avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
      }
    }
  ];

  constructor() { }

  getPlanos(): any[] {
    console.log('Teste: ', this.planos);
    return this.planos;
  }

}
