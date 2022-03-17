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
  isProcessing: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) { }

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
    if(this._podService.podcastListData.approvals == 'Live'){
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
      author_name: [this._podService.podcastListData.author_name, [Validators.required]],
      language: [this._podService.podcastListData.language, [Validators.required]],
      category: [this._podService.podcastListData.category.split(","), [Validators.required]],
      description: [this._podService.podcastListData.description, [Validators.required]],
      imagepath: this._podService.podcastListData.imagepath,
      audiopath: this._podService.podcastListData.audiopath,
      approvals: this._podService.podcastListData.approvals,
      // broadcast_date: this._podService.podcastListData.broadcast_date,
      // upload_date: this._podService.podcastListData.upload_date,
      age_restriction: Number(this._podService.podcastListData.age_restriction) ? true : false,
    })
  }


  updateProcast() {
    if (!this.podcastForm.valid) {
      this.isProcessing = false;
      this.ispodcastFormValid = false;
      return
    }
    if(this.noteDescription == ''){
      this.isProcessing = false;
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
    this.isProcessing = true;
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
      "note_description": this.noteDescription,
      "status": 'Pending'
    }
    this._webService.commonMethod('podcast/update', req, "PUT").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response) {
          this.router.navigate(['/', 'dashboard'])
        } else {

        }
        this.isProcessing = true;
      }
    )
  }

  uploadaudio(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file.type, "element");
     if(file.type.indexOf('audio') == -1){
       this.toaster.error("Invalid audio file");
       return
    }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.isProcessing = true;
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.audioFileName = data.Response;
        this.isProcessing = false;
      }, err => {
        // this._toastService.error("Error uploading file.");
      });
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }


  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    console.log(file, "element");
    if(file.type.indexOf('image') == -1){
      this.toaster.error("Invalid image");
      return
   }
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.isProcessing = true;
    this._webService.UploadDocument("s3bucket/upload", formData).
      subscribe((data: any) => {
        this.pictureFileName = data.Response;
        this.isProcessing = false;
      }, err => {
         this.toaster.error("Error uploading file.");
      });
    //}
    //  else {
    //    this.toaster.error('not a Audio File')
    //  }


  }

  removeFile(){
    let req = {
        filename : this.pictureFileName
    }
    this.isProcessing = true;
    this._webService.commonMethod("s3bucket/remove", req, 'DELETE').
      subscribe((data: any) => {
        this.isProcessing = false;
        this.pictureFileName = '';
      },err => {
        this.isProcessing = false;
        this.pictureFileName = '';
      });


  }

  removeAudio(){
    let req = {
        filename : this.audioFileName
    }
    this.isProcessing = true;
    this._webService.commonMethod("s3bucket/remove", this.audioFileName, 'DELETE').
      subscribe((data: any) => {
        this.isProcessing = false;
        this.audioFileName = '';
      },err => {
        this.audioFileName = '';
        this.isProcessing = false;
      });


  }

  logout(){
    this._podService.RJDasboardList = [];
    this._podService.RJDasboardList1 = [];
    localStorage.removeItem("user_data");
    localStorage.clear();
    this.router.navigate(['/', 'login']);
  }

}
