import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './public/login/login.component';
import { SignupComponent } from './public/signup/signup.component';
import { ForgotPasswordComponent } from './public/forgot-password/forgot-password.component';
import { RjRegisterComponent } from './public/rj-register/rj-register.component';
import { ResetPasswordComponent } from './public/reset-password/reset-password.component';
import { RegisterThanksComponent } from './public/register-thanks/register-thanks.component';
import { PodcastListComponent } from './private/podcast-list/podcast-list.component';
import { CreatePodcastComponent } from './private/create-podcast/create-podcast.component';
import { CreatePodcastConformationComponent } from './private/create-podcast-conformation/create-podcast-conformation.component';
import { AboutPodcastComponent } from './private/about-podcast/about-podcast.component';
import { EditPodcastComponent } from './private/edit-podcast/edit-podcast.component';
import { EditProfileComponent } from './public/edit-profile/edit-profile.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  {path: 'login', component: LoginComponent },
  {path: 'signup', component: SignupComponent },
  {path: 'forgot-password', component: ForgotPasswordComponent },
  {path: 'register', component: RjRegisterComponent },
  {path: 'reset-password', component: ResetPasswordComponent },
  {path: 'register-thanks', component: RegisterThanksComponent },
  {path: 'dashboard', component: PodcastListComponent },
  {path: 'create-podcast', component: CreatePodcastComponent },
  {path: 'create-podcast-conformation', component: CreatePodcastConformationComponent },
  {path: 'about-podcast', component: AboutPodcastComponent },
  {path: 'edit-podcast', component: EditPodcastComponent },
  {path: 'edit-profile', component: EditProfileComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    useHash: true,
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
