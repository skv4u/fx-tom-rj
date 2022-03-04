import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
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
    public fb: FormBuilder, public _webService: WebService) { }

  ngOnInit() {
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
      let req = {
        "LoginID": this.loginForm.value.username,
        "Password": this.loginForm.value.password
      }
      this._webService.commonMethod('user/login', req, "POST").subscribe(
        data => {
          console.log(data, "datadatadatadata");
        }
      )
    }
  }
}
