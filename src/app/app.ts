import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Side } from "./side/side.comp";
import { OpeBlock } from "./ope_block/ope_block.comp";
import { DataShare } from './data-share';
import { Dialog } from "./dialog/dialog";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Side, OpeBlock, Dialog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  constructor(
    public dataShare: DataShare
  ) { }
  protected readonly title = signal('ang_tes');
}
