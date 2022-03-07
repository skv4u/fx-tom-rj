import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PorcastService } from 'src/app/private/porcast.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
iscreatebuttonVisiable: boolean = false;
issettingOpen: boolean = false;
ShowFilter: boolean = false;
showBell: boolean = false;
  constructor(public router: Router, public _localStorage: LocalstorageService, public _podService: PorcastService) { }

  ngOnInit() {
    if(window.location.hash == '#/dashboard')
    this.iscreatebuttonVisiable = true;
  }
  LogOut(){
    localStorage.clear();
    this.router.navigate(['/', 'login'])
  }
}
