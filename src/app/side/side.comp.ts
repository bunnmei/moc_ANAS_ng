import { Component, signal, ElementRef, HostListener, OnInit ,ViewChild, AfterViewInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FolderPanelComp } from "../folder_panel/folder_panel.comp";
import { HttpClient } from '@angular/common/http';

export interface FolderData {
  id: number;
  name: string;
}

export interface FolderResponse {
  id: number,
  absolutePath: string;
  kind: string;
  open: boolean;
  name: string;
  type: "folder" | "file";
  children: FolderResponse[]
}

@Component({
  selector: 'app-side',
  // imports: [RouterOutlet],
  templateUrl: './side.comp.html',
  styleUrl: './side.comp.css',
  imports: [FolderPanelComp, CommonModule]
})
  
export class Side implements OnInit {

  public folderPanels: FolderResponse[] = [
    // { id: 1, name: 'Folder A' },
    // { id: 2, name: 'Folder B' },
    // { id: 3, name: 'Folder C' }
  ];

  isResizing = false;
  startX = 0;
  initialWidth = 0;

  @ViewChild('sidePanel', { static: true }) 
  sidePanelRef!: ElementRef;
  constructor(
    private el: ElementRef,
    private http: HttpClient
  ) { }
  ngOnInit(): void {
    this.fetchFolderData();
  }

  fetchFolderData(): void {
    // 実際にデータを返すAPIのエンドポイントURLに置き換えてください
    const apiUrl = 'http://192.168.1.112:8080/sd'; 

    this.http.post<FolderResponse[]>(apiUrl, { query: "/" })
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
          response.map((folder, i) => {
            folder.id = Date.now() + i
            this.folderPanels.push(folder)
          });
          // 成功後、フォルダリストを再フェッチするなど
        },
        // 失敗時の処理
        error: (err) => {
          console.error('フォルダ作成エラー:', err);
        }
      });
    
    // 1. http.get() でリクエストを送信。返ってくるデータの型 (FolderData[]) を指定。
    // this.http.get<FolderData[]>(apiUrl)
    //   .subscribe({
    //     // 2. データが正常に取得された場合
    //     next: (data) => {
    //       this.folderPanels = data; // 💡 取得したデータを配列に格納
    //       console.log('データ取得成功:', this.folderPanels);
    //     },
    //     // 3. エラーが発生した場合
    //     error: (err) => {
    //       console.error('データ取得エラー:', err);
    //       // 失敗時の代替処理（例: エラーメッセージ表示）
    //     },
    //     // 4. ストリームが完了した場合 (省略可)
    //     complete: () => {
    //       console.log('データフェッチ完了');
    //     }
    //   });
  }
  // コンポーネントのDOM要素にアクセスするための参照

  // 1. ハンドルがクリックされたらリサイズ開始
  startResize(event: MouseEvent) {
    console.log("startResize")
    this.isResizing = true;
    this.startX = event.clientX;
    // CSSの幅を取得
    this.initialWidth = this.el.nativeElement.offsetWidth; 
    event.preventDefault(); // テキスト選択などを防ぐ
  }

  // 2. マウスが移動したら幅を更新
  // document全体でイベントを監視（マウスが要素外に出ても追跡するため）
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    if (!this.isResizing) return;
    
    const deltaX = event.clientX
    console.log(deltaX)
    // console.log(this.initialWidth)
    // let newWidth = 300 + deltaX;

    // 最小幅/最大幅の制約を追加
    // if (newWidth < 150) newWidth = 150; 

    // style属性を直接変更
    // this.el.nativeElement.style.width = `${newWidth}px`; 
    // console.log(newWidth)

    if (this.sidePanelRef) {
      const sideDiv: HTMLElement = this.sidePanelRef.nativeElement;
      sideDiv.style.width = `${deltaX}px`;
    }
  }

  // 3. マウスが離されたらリサイズ終了
  @HostListener('document:mouseup')
  onMouseUp() {
    this.isResizing = false;
  }
}