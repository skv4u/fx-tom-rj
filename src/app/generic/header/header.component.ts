import { Component, OnInit, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { PorcastService } from 'src/app/private/porcast.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  iscreatebuttonVisiable: boolean = false;
  userName: string = this._podService.localStorageData.fullname;
  constructor(public router: Router, public _localStorage: LocalstorageService, public _podService: PorcastService, public webservice: WebService, public renderer: Renderer2) { }

  ngOnInit() {
    if (window.location.hash == '#/dashboard')
      this.iscreatebuttonVisiable = true;
  }
  LogOut() {
    this._podService.resetAllValues();
    // localStorage.clear();
    localStorage.removeItem('user_data');
    this.router.navigate(['/', 'login'])
  }

  updateNotification() {
    if (this._podService.localStorageData.approval_status == 'Pending' || this._podService.localStorageData.approval_status == 'Rejected') {
      return
    }
    let req = {
      "user_id": this._podService.localStorageData.id
    }
    this.webservice.commonMethod('user/notification/update', req, 'PUT').subscribe(
      (data) => {
        this._podService.getStatisticsList();
      }
    )
  }

  Expandsetting() {
    this._podService.AllfilterValues.issettingOpen = !this._podService.AllfilterValues.issettingOpen;
    this._podService.AllfilterValues.showBell = false;
    this._podService.AllfilterValues.ShowFilter = false;
    if (this._podService.AllfilterValues.issettingOpen) {
      this._podService.bindSingleClickEvent(this.renderer);
    }
  }
  ExpandBell() {
    this.updateNotification();
    this._podService.AllfilterValues.showBell = !this._podService.AllfilterValues.showBell;
    this._podService.AllfilterValues.ShowFilter = false;
    this._podService.AllfilterValues.issettingOpen = false
    if (this._podService.AllfilterValues.showBell) {
      this._podService.bindSingleClickEvent(this.renderer);
    }
  }

  ExpandFilter() {
    this._podService.AllfilterValues.ShowFilter = !this._podService.AllfilterValues.ShowFilter;
    this._podService.AllfilterValues.showBell = false;
    this._podService.AllfilterValues.issettingOpen = false;
    if (this._podService.AllfilterValues.ShowFilter) {
      this._podService.bindSingleClickEvent(this.renderer);
    }
  }

}
