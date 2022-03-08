import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  providers: [FormBuilder]
})
export class ResetPasswordComponent implements OnInit {
  resetForm: FormGroup;
  isresetFormValid: boolean = true;
  constructor(
    public fb: FormBuilder, public _webService: WebService, public router: Router, public toaster: ToastService, public _commonService: CommonService) { }
  ngOnInit() {
    this.resetForm = this.fb.group({
      newPassword: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    })
  }

}
