import { Component } from '@angular/core';
import { DataShare } from '../data-share';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpEventType } from '@angular/common/http';
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

  uploadProgress = 0;
  uploadStatus: 'idle' | 'uploading' | 'done' | 'error' = 'idle';
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
          this.dataShare.reloadCurrentFolder();
        },
        // 失敗時の処理
        error: (err) => {
          console.error('フォルダ作成エラー:', err);
        }
      });
  }

   onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);

    const formData = new FormData();
     
    const currentPath = this.dataShare.currentPath();
    formData.append('targetPath', currentPath);
    console.log(`アップロード先: ${currentPath}`);
     
    for (const file of files) {
      formData.append('files', file);
    }
    

    this.uploadStatus = 'uploading';
    this.uploadProgress = 0;

    this.http.post('http://192.168.1.112:8080/upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round((100 * event.loaded) / event.total);
        } else if (event.type === HttpEventType.Response) {
          this.uploadStatus = 'done';
          console.log('アップロード完了:', event.body);
        }
      },
      error: (err) => {
        this.uploadStatus = 'error';
        console.error('アップロード失敗:', err);
      }
    });
  }

  uploadFolderOrFile() {

  }

  downloadFolderOrFile() {
    console.log("downloadButton")

    // const formData = new FormData();
    // formData.append("uri", this.dataShare.currentPath())
    const jbody = { uri: this.dataShare.currentPath() };
    this.http.post('http://192.168.1.112:8080/download',
      jbody, { 
      responseType: 'blob' // バイナリで受け取る
    }).subscribe((blob) => {
      
      const parts = jbody.uri.split('/');
      const a = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      console.log(url)
      a.href = url;
      a.download = `${parts[parts.length-1]}.zip`;
      a.click();
      window.URL.revokeObjectURL(url);
    });
  }
}