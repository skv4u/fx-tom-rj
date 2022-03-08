import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../../porcast.service';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss']
})
export class DeletePopupComponent implements OnInit {
  description: string = '';
  constructor(public _webService: WebService, public _podService: PorcastService, public _localStorage: LocalstorageService, public router: Router, public toaster: ToastService) { }

  ngOnInit() {
    console.log(this._podService.deletedList,"this._podService.deletedList")
  }
  DeletePodcast() {
    let req = {
      "id": this._podService.deletedList.id,
      "user_id": this._localStorage.getUserData().id,
      "usertype": "RJ",
      "note_description": this.description,
      "status": "Delete",
      "created_by": this._localStorage.getUserData().username
    } 
    this._webService.commonMethod('podcast/delete', req, "POST").subscribe(
      data => {
        if (data.Status == 'Success' && data.Response && data.Response.length) {
          this.toaster.success("Deleted Successfully");
          this._podService.getPodcastList();
          this._podService.getStatisticsList();
          this._podService.isDelete = false;
        }
      }
    )
  }
}
