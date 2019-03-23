import { Component, OnInit, AfterViewInit, DoCheck } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {MatDialog} from '@angular/material';

import { PlanosService } from '../service/planos.service';
import { CriarPlanoComponent } from './criar-plano/criar-plano.component';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {

  constructor(
    private planosService: PlanosService,
    private dialog: MatDialog
  ) { }

  ngOnInit() { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.planosService.getPlanos(), event.previousIndex, event.currentIndex);
  }

  openDialog() {
    const dialogRef = this.dialog.open(CriarPlanoComponent, { disableClose: true });
    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

}
