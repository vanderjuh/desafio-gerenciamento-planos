import { Component, OnInit } from '@angular/core';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { PlanosService } from '../service/planos.service';

@Component({
  selector: 'app-planos',
  templateUrl: './planos.component.html',
  styleUrls: ['./planos.component.css']
})
export class PlanosComponent implements OnInit {

  constructor(private planosService: PlanosService) { }

  ngOnInit() { }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.planosService.getPlanos(), event.previousIndex, event.currentIndex);
  }

}
