import { Component } from '@angular/core';
import { ResponsividadeService } from './service/responsividade.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'prototipo-gerenciamento-planos';

  constructor(private responsividadeService: ResponsividadeService) {
    this.responsividadeService.onInitResponsividade();
  }

}
