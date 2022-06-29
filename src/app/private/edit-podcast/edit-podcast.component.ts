import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';
@Component({
  selector: 'app-edit-podcast',
  templateUrl: './edit-podcast.component.html',
  styleUrls: ['./edit-podcast.component.scss']
})
export class EditPodcastComponent implements OnInit {

  podcastForm: FormGroup;
  ispodcastFormValid: boolean = true;
  categoryList: any[] = [];
  audioFileName: string = '';
  pictureFileName: string = '';
  noteDescription: string = '';
  isselectAudio: boolean = true;
  // _podService.loader: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService
   ) { }

  ngOnInit() {
    this._podService.isListPage = false;
    this._podService.iscreatebuttonVisiable = false;
    if (!this._podService.podcastListData) {
      this.router.navigate(['/', 'dashboard'])
      return
    }
    if (this._podService.localStorageData.approval_status == 'Pending') {
      this.toaster.error('Your approval is pending.')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    if (this._podService.localStorageData.approval_status == 'Rejected') {
      this.toaster.error('Please contact Admin')
      this.router.navigate(['/', 'dashboard'])
      return
    }
    if (this._podService.podcastListData.approvals == 'Live') {
      this.toaster.error("Podcast has been live now");
      this.router.navigate(['/', 'dashboard'])
      return
    }
    this._podService.getNodeList();
    // this._podService.getCategoryList();
    // this._podService.getLanguageList();
    this.audioFileName = this._podService.podcastListData.audiopath;
    this.pictureFileName = this._podService.podcastListData.imagepath;
    this.podcastForm = this.fb.group({
      name: [this._podService.podcastListData.name, [Validators.required]],
      author_name: '',
      language: [this._podService.podcastListData.language, [Validators.required]],
      category: [this._podService.podcastListData.category.split(","), [Validators.required]],
      description: [this._podService.podcastListData.description, [Validators.required]],
      imagepath: this._podService.podcastListData.imagepath,
      audiopath: this._podService.podcastListData.audiopath,
      approvals: this._podService.podcastListData.approvals,
      show: this._podService.podcastListData.shows_id,
      // broadcast_date: this._podService.podcastListData.broadcast_date,
      // upload_date: this._podService.podcastListData.upload_date,
      age_restriction: Number(this._podService.podcastListData.age_restriction) ? true : false,
    })
  }


  updateProcast() {
    if (!this.podcastForm.valid) {
      this._podService.loader = false;
      this.ispodcastFormValid = false;
      return
    }
    if (this.noteDescription == '') {
      this._podService.loader = false;
      this.toaster.error("Notes are Required")
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
    let req = {
      "id": this._podService.podcastListData.id,
      "user_id": this._podService.localStorageData.id,
      "name": this.podcastForm.value.name,
      "author_name": this.podcastForm.value.author_name,
      "language": this.podcastForm.value.language,
      "category": this.podcastForm.value.category.join(","),
      "description": this.podcastForm.value.description,
      "imagepath": this.pictureFileName,
      "audiopath": this.audioFileName,
      "age_restriction": this.podcastForm.value.age_restriction ? 1 : 0,
      "created_by": this._podService.localStorageData.username,
      "usertype": "RJ",
      "shows_id": this.podcastForm.value.show,
      "note_description": this.noteDescription,
      "status": 'Pending'
    }
    this._webService.commonMethod('podcast/update', req, "PUT").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this.router.navigate(['/', 'dashboard'])
        } else {

        }
        this._podService.loader = true;
      }, err => {
        if (err.status === 401) {
          this._podService.TokenExpied();
        }
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
  //       // this._toastService.error("Error uploading file.");
  //     });
  //   //  else {
  //   //    this.toaster.error('not a Audio File')
  //   //  }


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

  removeFile() {
    this.pictureFileName = "";
    // let req = {
    //     filename : this.pictureFileName
    // }
    // this._podService.loader = true;
    // this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
    //   subscribe((data: any) => {
    //     this._podService.loader = false;
    //     this.pictureFileName = '';
    //   },err => {
    //     this._podService.loader = false;
    //     this.pictureFileName = '';
    //   });


  }

  removeAudio() {
    this.audioFileName = "";
    // let req = {
    //     filename : this.audioFileName
    // }
    // this._podService.loader = true;
    // this._webService.commonMethod("s3bucket/remove", this.audioFileName, 'DELETE').
    //   subscribe((data: any) => {
    //     this._podService.loader = false;
    //     this.audioFileName = '';
    //   },err => {
    //     this.audioFileName = '';
    //     this._podService.loader = false;
    //   });


  }

  // logout(){
  //   this._podService.RJDasboardList = [];
  //   this._podService.RJDasboardList1 = [];
  //   localStorage.removeItem("user_data");
  //   localStorage.clear();
  //   this.router.navigate(['/', 'login']);
  // }

  uploadaudio(element) {​​ 
    const file = element[0];
  if (file == undefined) return;
  // console.log(file.type, "element");
  if (this._webService.validAudioList().indexOf(file.type) == -1) {
    this.toaster.error("Invalid audio file");
    return
  }
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
    const file = element[0];
    if (file == undefined) return;
    if (this._webService.validImageList().indexOf(file.type) == -1) {
      this.toaster.error("Invalid image");
      return
    }
    this._podService.loader = true;
    this._podService.loaderMessage = "Uploading...";
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

  getAudioName() {
    if (this.audioFileName) {
      let str = this.audioFileName.substring(this.audioFileName.lastIndexOf("/") + 1);
      return str.substring(str.indexOf("_") + 1);
    }
    return '';
  }
  IsImageGallaryVisible: boolean = false;
  openExistingImageList() {
    this.IsImageGallaryVisible = true;
  }

  fromChild(elem) {
    this.pictureFileName = elem;
    this.IsImageGallaryVisible = false;
  }

  showsimageSelection(){
    if(this.podcastForm.value.show != -1){
      for(let image of this._podService.showList){
        if(this.podcastForm.value.show == image.shows_id){
          this.pictureFileName = image.image
        }
      }
    }else{
      this.pictureFileName = '';
    }
  }

}
