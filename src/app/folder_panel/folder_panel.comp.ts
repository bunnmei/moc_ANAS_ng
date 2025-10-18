import { Component, Input, OnInit, OnChanges, ViewChild,SimpleChanges, ElementRef, signal, effect} from '@angular/core';

import { FolderResponse } from '../side/side.comp';
import { HttpClient } from '@angular/common/http';
import { FilePanelComp } from "../file_panel/file_panel.comp";
import { DataShare } from '../data-share';


@Component({
  selector: 'app-folder-panel',
  templateUrl: './folder_panel.comp.html',
  styleUrls: ['./folder_panel.comp.css'],
  imports: [FilePanelComp]
})
export class FolderPanelComp implements OnInit, OnChanges {

  childStatus = signal<'no_fetch' | 'fetching' | 'fetched'>('no_fetch')

  @Input() 
  public folderData!: FolderResponse;

  constructor(
    private http: HttpClient,
    public dataShare: DataShare
  ) {

    effect(() => {
      const info = this.dataShare.currentFolder();
      if (!info) return;

      const { folder, reason } = info;

      if (reason === 'reload') {
        console.log('再読み込み:', folder.name);
        this.reloadFolder();
      } else {
        console.log('選択変更:', folder.name);
      }
    });
  }

  ngOnInit(): void {
    // コンポーネントが初期化されたとき、この folderData に親から渡されたデータが入っています
    console.log('受け取ったデータ:', this.folderData.name);
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log("folder_panel.comp.ts - ")
    if (changes['folderData']) {
      console.log('folderDataが更新されました:', this.folderData.name);
      this.reloadFolder();
    }
  }


  @ViewChild('icon', { static: true }) 
  iconRef!: ElementRef;

  openFolder() {
    console.log("openFolder")

    if (this.folderData.open) {
      this.folderData.open = false
      this.iconRef.nativeElement.style.transform = 'rotate(0deg)'

    } else {
      this.fetchFolderData()
      this.folderData.open = true
      this.iconRef.nativeElement.style.transform = 'rotate(90deg)'
      
    }
  }

  setPath() {
    console.log(`${this.folderData.absolutePath}`)
    this.dataShare.setNewPath(`${this.folderData.absolutePath}`)
    this.dataShare.setCurrentFolder(this.folderData); 
    // this.dataShare.currentPath.set(`${this.folderData.absolutePath}`)
  }

  fetchFolderData(): void {
    // 実際にデータを返すAPIのエンドポイントURLに置き換えてください
    const apiUrl = 'http://192.168.1.112:8080/sd';
    
    // if(this.childStatus() !== 'no_fetch') return
    this.childStatus.set('fetching')
    this.http.post<FolderResponse[]>(apiUrl, { query: this.folderData.absolutePath })
      .subscribe({
        // 成功時の処理（例: サーバーが新しく作成されたフォルダを返した場合）
        next: (response) => {
          console.log('フォルダ作成成功:', response);
          response.sort((a, b) => {
            if (a.type === 'folder') {
              return -1; // a（folder）をb（file）より前に
            }
            // typeが同じ場合（folder同士、またはfile同士）は、名前などでさらに並び替えを行うか、0を返す
            return a.name.localeCompare(b.name); // 例: 同じtypeの場合は名前で昇順に並び替え
          });
          this.folderData.children = []
          response.map((folder, i) => {
            folder.id = Date.now() + i
            this.folderData.children.push(folder)
          })
          this.childStatus.set('fetched')
          // 成功後、フォルダリストを再フェッチするなど
        },
        // 失敗時の処理
        error: (err) => {
          console.error('フォルダ作成エラー:', err);
        }
      });
  }


  reloadFolder() {
    if (this.folderData.open) {
      console.log('フォルダ再読み込み:', this.folderData.absolutePath);
      this.childStatus.set('no_fetch');
      this.fetchFolderData();
    }
  }
}