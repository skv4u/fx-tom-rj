import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PorcastService } from 'src/app/private/porcast.service';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  isloginFormValid: boolean = true;
  constructor(
    public fb: FormBuilder, public _webService: WebService,
    public _localStorage: LocalstorageService,
    public router: Router,
    public toaster: ToastService,
    public _podCastService: PorcastService) { }
  ngOnInit() {
    if (this._localStorage.getUserData()) {
      this.router.navigate(['/', 'dashboard'])
      return
    }
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
  signin() {
    if (!this.loginForm.valid) {
      this.isloginFormValid = false;
      return
    } else {
      this._podCastService.loader = true;
      let req = {
        "username": this.loginForm.value.username,
        "password": this.loginForm.value.password
      }
      this._webService.commonMethod('user/login', req, "POST").subscribe(
        data => {
        //  if(data.Status == 'Success'){
            let decriptData = atob(data.Response);
            data.Response = JSON.parse(decriptData)
         // }
          if (data.Status == 'Success' && data.Response && data.Response.userdata && data.Response.token && typeof data.Response != 'string') {
            this._localStorage.setUserData(data.Response.userdata);
           //this._localStorage.setItem('rjttptoken', data.Response.token); 
           localStorage.setItem('rjttptoken', data.Response.token);
            this._podCastService.localStorageData = data.Response.userdata;
            this._podCastService.getCategoryList();
            this._podCastService.getLanguageList();
            // console.log(this._podCastService.localStorageData, "this._podCastService.localStorageData");
            this.router.navigate(['/', 'dashboard'])
          } else {
            this.toaster.error(data.Response);
          }
          this._podCastService.loader = false;
          //console.log(data, "datadatadatadata");
        }
      )
    }
  }
}
