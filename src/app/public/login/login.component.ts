import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
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
  isProcessing: boolean = false;
  constructor(
    public fb: FormBuilder, public _webService: WebService, 
    public _localStorage: LocalstorageService, 
    public router: Router,
    public toaster: ToastService) { }
  ngOnInit() {
    if(this._localStorage.getUserData()){
    this.router.navigate(['/','dashboard'])
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
      this.isProcessing = true;
      let req = {
        "username": this.loginForm.value.username,
        "password": this.loginForm.value.password
      }
      this._webService.commonMethod('user/login', req, "POST").subscribe(
        data => {
          if(data.Status == 'Success' && data.Response){
          this._localStorage.setUserData(data.Response);
          this.router.navigate(['/', 'dashboard'])
          }else {
           this.toaster.error(data.Response);
          }
          this.isProcessing = false;
          //console.log(data, "datadatadatadata");
        }
      )
    }
  }
}
