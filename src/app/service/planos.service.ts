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

  ELEMENT_DATA: any[] = [
    {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
    {position: 2, name: 'Helium', weight: 4.0026, symbol: 'He'},
    {position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li'},
    {position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be'},
    {position: 5, name: 'Boron', weight: 10.811, symbol: 'B'},
    {position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C'},
    {position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N'},
    {position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O'},
    {position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F'},
    {position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne'},
    {position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na'},
    {position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg'},
    {position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al'},
    {position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si'},
    {position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P'},
    {position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S'},
    {position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl'},
    {position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar'},
    {position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K'},
    {position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca'},
  ];

  responsaveis: any[] = [
    {
      id: 1,
      nome: 'Vanderley Sousa da Silva Junior',
      email: 'vanderley@forlogic.net',
      avatar: 'http://localhost:4200/assets/img/vanderley.jpg'
    },
    {
      id: 2,
      nome: 'Karyne Vitoria Gomes da Silva',
      email: 'karyne@forlogic.net',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRduRK7rUyaC1NLN-SzkASvPdz4VXJgf4Qdp9oLnln0ddKgJHA3yg'
    },
    {
      id: 3,
      nome: 'Edineuza Gomes da Silva',
      email: 'edineuza@forlogic.net',
      avatar: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNNJ--GLMh-YVxfXnZcxtrD_-LjipAhK6JHxfd14Yo0E1-TDXa'
    },
    {
      id: 4,
      nome: 'Renan Fermino da Silva',
      email: 'renan@forlogic.net',
      // tslint:disable-next-line: max-line-length
      avatar: 'https://s3.amazonaws.com/igd-wp-uploads-pluginaws/wp-content/uploads/2016/05/30105213/Qual-e%CC%81-o-Perfil-do-Empreendedor.jpg'
    }
  ];

  constructor() { }

  getPlanos(): any[] {
    console.log('Teste: ', this.planos);
    return this.planos;
  }

  getResponsaveis(): any[] {
    console.log(this.responsaveis)
    return this.responsaveis;
  }

}
