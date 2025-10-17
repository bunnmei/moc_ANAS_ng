import { Component, Input } from '@angular/core';
import { FolderResponse } from '../side/side.comp';


@Component({
  selector: 'app-file-panel',
  templateUrl: './file_panel.comp.html',
  styleUrls: ['./file_panel.comp.css']
})
export class FilePanelComp {

  @Input()
  public folderData!: FolderResponse;
  
}