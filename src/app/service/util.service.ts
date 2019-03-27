import { MatSnackBar } from '@angular/material';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UtilService {

    constructor(
        private snackBar: MatSnackBar
    ) { }

    abrirSnackBar(message: string, time: number) {
        this.snackBar.open(message, null, { duration: time });
    }

}
