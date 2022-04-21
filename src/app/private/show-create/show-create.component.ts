import { HttpEventType } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';


@Component({
  selector: 'app-show-create',
  templateUrl: './show-create.component.html',
  styleUrls: ['./show-create.component.scss']
})
export class ShowCreateComponent implements OnInit {
  NewShowName: string = '';
  NewShowImage: string = '';
  apiCalled: boolean = false;
  CategoryList: any = [];
  imageUrl: any = "";
  showConfirmPopup: any = "";
  Id: any = 0;
  caption = {
    "title":"Add Shows",
    "button":"Add New Shows"
  }
  constructor(public router: Router, public webservice: WebService, public prodCastService: PorcastService, public localStorage: LocalstorageService, public toast: ToastService) { }

  ngOnInit() {
    this.prodCastService.isListPage = false;
    this.prodCastService.iscreatebuttonVisiable = false;
    this.prodCastService.getshowList();
  }
  createShows() {
    if (this.NewShowImage == '') {
      this.toast.error('Please provide image');
      return
    }
    if (this.NewShowName == '') {
      this.toast.error("Please provide Show Name");
      return
    }
    this.prodCastService.loader = true;
    let req =
    // {
    //   "name": this.NewShowName,
    //   "created_by": this.localStorage.getUserData() ? this.localStorage.getUserData().username : '',
    //   "image": this.NewShowImage
    // }
    {
      "shows_id": this.Id, 
      "user_id": this.prodCastService.localStorageData.id,
      "name": this.NewShowName,
      "image": this.NewShowImage
    }
    this.webservice.commonMethod('/user/shows', req, 'POST').subscribe(
      (data) => {
        if(data.Status == 'Success'){
        if(this.Id){
          this.toast.success("Show updated successfully");
        }else {
          this.toast.success("Show created successfully");  
        }
      }else{
        this.toast.error(data.Response);
      }
        this.ResetShow();
        this.prodCastService.loader = false;
        this.prodCastService.getshowList();
      },
      err => {
        this.prodCastService.loader = false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }
  deleteProdCast(id) {
    this.prodCastService.loader = true;
    let req = {
      "user_id": this.prodCastService.localStorageData.id,
      "shows_id": id
    }
    this.webservice.commonMethod('/user/shows', req, 'DELETE').subscribe(
      (data) => {
        if (data.Status == "Success") {
          this.toast.success("Deleted successfully");
          this.ResetShow();
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.prodCastService.getshowList();
        } else {
          this.prodCastService.loader = false;
          this.showConfirmPopup = false;
          this.toast.error(data.Response);
        }

      },
      err => {
        this.prodCastService.loader = false;
        this.showConfirmPopup = false;
        this.toast.error("Oops, Something went wrong");
      }
    )
  }

  uploadFile(element) {
    const file = element[0];
    if (file == undefined) return;
    if (this.webservice.validImageList().indexOf(file.type) == -1) {
      this.toast.error("Invalid image");
      return
    }
    this.prodCastService.loader = true;
    this.prodCastService.loaderMessage = "Uploading...";
    // console.log(file, "element");
    let formData = new FormData();
    formData.append('filename', file, file.name);
    this.webservice.UploadDocument1("s3bucket/upload", formData).
      subscribe((data: any) => {
        if (data.type === HttpEventType.Response) {
          this.NewShowImage = data.body.Response;
          this.prodCastService.loader = false;
          this.prodCastService.loaderMessage = "loading...";
        }
        if (data.type === HttpEventType.UploadProgress) {
          const percentDone = Math.round(100 * data.loaded / data.total);
          this.prodCastService.loaderMessage = " Uploading :  " + percentDone + "%";
        }
      }, err => {
        this.prodCastService.loader = false;
        this.NewShowImage = "";
        this.prodCastService.loaderMessage = "loading...";
      });
  }
  isupdate: boolean = false;
  editCategory(ele: any) {
    this.NewShowName = ele.name;
    this.NewShowImage = ele.image;
    this.caption = {
      "title":"Update Shows",
      "button":"Update Shows"
    }
    this.Id = ele.shows_id;
    window.scrollTo(0, 0)
  }
  ResetShow(){
    this.NewShowName = '';
    this.NewShowImage ='';
    this.caption = {
      "title":"Add Shows",
      "button":"Add New Shows"
    }
    this.Id = 0;
  }
  removeFile(){
    let req = {
      filename : this.NewShowImage
  }
  this.prodCastService.loader = true;
  this.webservice.commonMethod("s3bucket/remove", req, 'DELETE').
    subscribe((data: any) => {
      this.prodCastService.loader = false;
      this.NewShowImage = '';
    },err => {
      this.prodCastService.loader = false;
      this.NewShowImage = '';
    });

  }
}

