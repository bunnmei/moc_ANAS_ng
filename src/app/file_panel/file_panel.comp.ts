import { Component, Input } from '@angular/core';
import { FolderResponse } from '../side/side.comp';
import { DataShare } from '../data-share';

@Component({
  selector: 'app-file-panel',
  templateUrl: './file_panel.comp.html',
  styleUrls: ['./file_panel.comp.css']
})
export class FilePanelComp {

  constructor(
    public dataShare: DataShare
  ) { 

  }

  @Input()
  public folderData!: FolderResponse;
  
  setPath() {
    this.dataShare.setNewPath(`${this.folderData.absolutePath}`)
    this.dataShare.setCurrentFolder(this.folderData);
  }
}