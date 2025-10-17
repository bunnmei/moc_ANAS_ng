import { Injectable, signal } from '@angular/core';
import { opeBtnType } from './ope_block/ope_block.comp'

@Injectable({
  providedIn: 'root'
})
export class DataShare {
  currentPath = signal<string>("/");
  dialogType = signal<opeBtnType>('none')

  setNewPath(newPath: string) {
    this.currentPath.set(newPath)
  }
}