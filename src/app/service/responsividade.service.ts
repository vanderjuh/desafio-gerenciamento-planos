import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ResponsividadeService {

  responsividade = false;
  menuLateral = true;
  modoMenuLateral = 'side';

  constructor() { }

  onInitResponsividade(): void {
    this.onResize();
    window.onresize = () => { this.onResize(); };
  }

  private onResize(): void {
    if (window.innerWidth < 744) {
      this.responsividade = true;
      this.menuLateral = false;
      this.modoMenuLateral = 'over';
    } else {
      this.responsividade = false;
      this.menuLateral = true;
      this.modoMenuLateral = 'side';
    }
  }

}
