import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-create-podcast',
  templateUrl: './create-podcast.component.html',
  styleUrls: ['./create-podcast.component.scss']
})
export class CreatePodcastComponent implements OnInit {

  podcastForm: FormGroup;
  ispodcastFormValid: boolean = true;
  audioFileName: string = '';
  pictureFileName: string = '';
  issettingOpen: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public _podService: PorcastService, public toaster: ToastService, public _localStorage: LocalstorageService, public router: Router) { }

  ngOnInit() {
    this._podService.isListPage = false;
    if(this._podService.localStorageData.approval_status == 'Pending'){
      this.toaster.error('Your approval is pending.')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    if (this._podService.localStorageData.approval_status == 'Rejected') {
      this.toaster.error('Please contact Admin')
      this.router.navigate(['/', 'dashboard'])
      return
    }

    this.podcastForm = this.fb.group({
      name: ['', [Validators.required]],
      author_name: '',
      language: ['Telugu', [Validators.required]],
      category: ['', [Validators.required]],
      description: ['', [Validators.required]],
      imagepath: '',
      audiopath: '',
      approvals: '',
      age_restriction: false,
    })
  }
  createProcast() {
    if (!this.podcastForm.valid) {
      this._podService.loader = false;
      this.ispodcastFormValid = false;
      return
    }
    if (this.audioFileName == '') {
      this.toaster.error("Audio file is required")
      return
    }
    if (this.pictureFileName == '') {
      this.toaster.error("Podcast image is required")
      return
    }
    this._podService.loader = true;
    console.log(this._podService.localStorageData,"this._podService.localStorageData");
    let req = {
      "user_id": this._podService.localStorageData.id,
      "name": this.podcastForm.value.name,
      "author_name": this.podcastForm.value.author_name,
      "language": this.podcastForm.value.language,
      "category": this.podcastForm.value.category.join(","),
      "description": this.podcastForm.value.description,
      "imagepath": this.pictureFileName,
      "audiopath": this.audioFileName,
      "approvals": "Pending",
      "age_restriction": this.podcastForm.value.age_restriction ? 1 : 0,
      "created_by": this._podService.localStorageData.username
    }
    console.log(req)
    this._webService.commonMethod('podcast/create', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this.router.navigate(['/', 'create-podcast-conformation'])
        }else {

        }
        this._podService.loader = false;
      }
    )
  }

  // uploadaudio(element) {
  //   const file = element[0];
  //   if (file == undefined) return;
  //   console.log(file.type, "element");
  //    if(!(file.type.indexOf('audio') != -1 || file.type.indexOf('video') != -1)){
  //      this.toaster.error("Invalid audio file");
  //      return
  //   }
  //   let formData = new FormData();
  //   formData.append('filename', file, file.name);
  //   this._podService.loader = true;
  //   this._webService.UploadDocument("s3bucket/upload", formData).
  //     subscribe((data: any) => {
  //       this.audioFileName = data.Response;
  //       this._podService.loader = false;
  //     }, err => {
  //     });


  // }


  // uploadFile(element) {
  //   const file = element[0];
  //   if (file == undefined) return;
  //   console.log(file, "element");
  //   if(file.type.indexOf('image') == -1){
  //     this.toaster.error("Invalid image");
  //     return
  //  }
  //   let formData = new FormData();
  //   formData.append('filename', file, file.name);
  //   this._podService.loader = true;
  //   this._webService.UploadDocument("s3bucket/upload", formData).
  //     subscribe((data: any) => {
  //       this.pictureFileName = data.Response;
  //       this._podService.loader = false;
  //     }, err => {
  //        this.toaster.error("Error uploading file.");
  //     });
  //   //}
  //   //  else {
  //   //    this.toaster.error('not a Audio File')
  //   //  }


  // }

  removeFile(){
    let req = {
        filename : this.pictureFileName
    }
    this._podService.loader = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this._podService.loader = false;
        this.pictureFileName = '';
      },err => {
        this.pictureFileName = '';
        this._podService.loader = false;
      });


  }

  removeAudio(){
    let req = {
        filename : this.audioFileName
    }
    this._podService.loader = true;
    this._webService.commonMethod("s3bucket/remove", this.audioFileName, 'DELETE').
      subscribe((data: any) => {
        this._podService.loader = false;
        this.audioFileName = '';
      },err => {
        this._podService.loader = false;
        this.audioFileName = '';
      });


  }

  logout(){
    this._podService.RJDasboardList = [];
    this._podService.RJDasboardList1 = [];
    localStorage.clear();
    this.router.navigate(['/', 'login']);
  }

uploadaudio(element) {​​ 
  const file = element[0];
if (file == undefined) return;
// console.log(file.type, "element");
if(!(file.type.indexOf('audio') != -1 || file.type.indexOf('video') != -1)){​​
this.toaster.error("Invalid audio file");
return
}​​
let formData = new FormData();
formData.append('filename', file, file.name);
this._podService.loader = true;
this._podService.loaderMessage = "Uploading...";
this._webService.UploadDocument1("s3bucket/upload", formData).
subscribe((data: any) => {​​
if (data.type === HttpEventType.Response) {​​
console.log(data);
this.audioFileName = data.body.Response;
this._podService.loader = false;
this._podService.loaderMessage = "Loading...";
}​​
if (data.type === HttpEventType.UploadProgress) {​​
const percentDone = Math.round(100 * data.loaded / data.total);
this._podService.loaderMessage = " Uploading : " + percentDone + "%";
}​​
}​​, err => {​​ 
  this._podService.loader = false;
this._podService.loaderMessage = "Loading...";
this.audioFileName = "";
}​​);
// subscribe((data: any) => {​​
// this.EditData.audiopath = data.Response;
// this._podService.loader = false;
// }​​, err => {​​
// }​​); 
}​​ 
uploadFile(element) {​​
this._podService.loader=true;
this._podService.loaderMessage = "Uploading...";
const file = element[0];
if (file == undefined) return;
// console.log(file, "element");
let formData = new FormData();
formData.append('filename', file, file.name);
this._webService.UploadDocument1("s3bucket/upload", formData).
subscribe((data: any) => {​​
if (data.type === HttpEventType.Response) {​​
this.pictureFileName = data.body.Response;
this._podService.loader = false;
this._podService.loaderMessage = "Loading...";
}​​
if (data.type === HttpEventType.UploadProgress) {​​
const percentDone = Math.round(100 * data.loaded / data.total);
this._podService.loaderMessage = " Uploading : " + percentDone + "%";
}​​
}​​, err => {​​
this._podService.loader = false;
this.pictureFileName = "";
this._podService.loaderMessage = "Loading...";
}​​);
}
}
