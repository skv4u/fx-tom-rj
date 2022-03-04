import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './public/login/login.component';
import { SignupComponent } from './public/signup/signup.component';
import { PodcastListComponent } from './private/podcast-list/podcast-list.component';
import { ForgotPasswordComponent } from './public/forgot-password/forgot-password.component';
import { RjRegisterComponent } from './public/rj-register/rj-register.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { RegisterThanksComponent } from './public/register-thanks/register-thanks.component';
import { WebService } from './shared/services/web.service';
import { HttpClientModule } from '@angular/common/http';
import { CreatePodcastComponent } from './private/create-podcast/create-podcast.component';
import { CreatePodcastConformationComponent } from './private/create-podcast-conformation/create-podcast-conformation.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    PodcastListComponent,
    ForgotPasswordComponent,
    RjRegisterComponent,
    ResetPasswordComponent,
    RegisterThanksComponent,
    CreatePodcastComponent,
    CreatePodcastConformationComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule, 
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [WebService],
  bootstrap: [AppComponent]
})
export class AppModule { }
