import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-criar-plano',
  templateUrl: './criar-plano.component.html',
  styleUrls: ['./criar-plano.component.css']
})
export class CriarPlanoComponent implements OnInit {

  minDate = new Date(2019, 3, 21);
  maxDate = new Date(2019, 3, 24);

  constructor() { }

  ngOnInit() {
  }

}
