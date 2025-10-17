import { Component } from '@angular/core';
import { DataShare } from '../data-share';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css']
})
export class Dialog {
  constructor(
    public dataShare: DataShare
  ) { }


  closeDialog() {
    this.dataShare.dialogType.set('none')
  }

  none() {
    console.log("clicked dialog panel")
  }
}