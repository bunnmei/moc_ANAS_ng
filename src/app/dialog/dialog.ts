import { Component } from '@angular/core';
import { DataShare } from '../data-share';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.html',
  styleUrls: ['./dialog.css'],
  imports: [FormsModule],
})
export class Dialog {
  constructor(
    public dataShare: DataShare,
    private http: HttpClient,
  ) { }

  newFolderName = ''

  closeDialog() {
    this.dataShare.dialogType.set('none')
  }

  none() {
    console.log("clicked dialog panel")
  }

  createFolder() {
    const apiUrl = 'http://192.168.1.112:8080/create_folder';
    if(this.newFolderName === "") return
    this.http
      .post(apiUrl, {
        path: this.dataShare.currentPath(),
        folderName: this.newFolderName
      })
      .subscribe({
        // 成功時の処理（例: サーバーが新しく作成されたフォルダを返した場合）
        next: (response) => {
          console.log('フォルダ作成成功:', response);
        },
        // 失敗時の処理
        error: (err) => {
          console.error('フォルダ作成エラー:', err);
        }
      });
  }
}