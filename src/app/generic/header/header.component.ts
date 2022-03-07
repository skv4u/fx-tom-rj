import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
iscreatebuttonVisiable: boolean = false;
issettingOpen: boolean = false;
  constructor(public router: Router) { }

  ngOnInit() {
    if(window.location.hash == '#/dashboard')
    this.iscreatebuttonVisiable = true;
  }
  LogOut(){
    localStorage.clear();
    this.router.navigate(['/', 'login'])
  }
}
