import { Component, effect, OnInit, signal } from '@angular/core';
import { DataShare } from '../data-share';

export type opeBtnType = 'folder' | 'upload' | 'none';

@Component({
  selector: 'app-ope-block',
  templateUrl: './ope_block.comp.html',
  styleUrls: ['./ope_block.comp.css']
})
export class OpeBlock {
  constructor(
    public dataShare: DataShare
  ) {
    effect(() => {
      console.log(`${this.dataShare.currentPath()}`)
    })
  }


  openFolderOrFile() {
    window.open(`http://192.168.1.112:8080/public${this.dataShare.currentPath()}`)
  }

  openDialog(type: opeBtnType) {
    this.dataShare.dialogType.set(type)
  }
}