import { Injectable, signal } from '@angular/core';
import { opeBtnType } from './ope_block/ope_block.comp'
import { FolderResponse } from './side/side.comp';


export interface FolderUpdate {
  folder: FolderResponse;
  reason: 'set' | 'reload';
}
@Injectable({
  providedIn: 'root'
})
export class DataShare {
  currentPath = signal<string>("/");
  dialogType = signal<opeBtnType>('none')
  currentFolder = signal<FolderUpdate | null>(null);

  setCurrentFolder(folder: FolderResponse) {
      this.currentFolder.set({ folder, reason: 'set' });
  }

  reloadCurrentFolder() {
    const folder = this.currentFolder();
    if (folder) {
          const folder = this.currentFolder();
      if (folder) {
        console.log("data-share.ts reload...folder");
        this.currentFolder.set({ folder: { ...folder.folder }, reason: 'reload' });
      }
    }
  }

  setNewPath(newPath: string) {
    this.currentPath.set(newPath)
  }
}