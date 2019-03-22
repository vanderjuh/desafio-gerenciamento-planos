import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsividadeService {

  responsividade = false;
  menuLateral = true;

  constructor() { }

  onInitResponsividade(): void {
    this.onResize();
    window.onresize = () => { this.onResize(); };
  }

  private onResize(): void {
    if (window.innerWidth < 700) {
      this.responsividade = true;
      this.menuLateral = false;
    } else {
      this.responsividade = false;
      this.menuLateral = true;
    }
  }

}
