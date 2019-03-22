import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-menu-superior',
  templateUrl: './menu-superior.component.html',
  styleUrls: ['./menu-superior.component.css']
})
export class MenuSuperiorComponent implements OnInit {

  onMostrarModulosQualiex = false;

  constructor() { }

  ngOnInit() {
  }

  onToggleMostrarModulosQualiex(): void {
    this.onMostrarModulosQualiex = !this.onMostrarModulosQualiex;
  }

  onStyleModulosQualiexAberto(): object {
    if(this.onMostrarModulosQualiex){
      return {
        backgroundColor: 'rgba(13, 43, 61, .5)'
      }
    }
  }

}
