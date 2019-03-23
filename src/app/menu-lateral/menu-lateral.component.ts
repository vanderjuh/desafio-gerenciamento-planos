import { Component, OnInit } from '@angular/core';
import { ResponsividadeService } from '../service/responsividade.service';

@Component({
  selector: 'app-menu-lateral',
  templateUrl: './menu-lateral.component.html',
  styleUrls: ['./menu-lateral.component.css']
})
export class MenuLateralComponent implements OnInit {

  constructor(private responsividadeService: ResponsividadeService) { }

  ngOnInit() {
  }

  onFecharMenuLateral(): void {
    if (this.responsividadeService.responsividade) {
      this.responsividadeService.menuLateral = false;
    }
  }

}
