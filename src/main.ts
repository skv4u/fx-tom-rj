import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
// let url = window.location.origin+'/api/token/';
// if(window.location.host.includes("localhost")){
//   // url = "http://ec2-15-207-52-38.ap-south-1.compute.amazonaws.com/api/token/"; // Prod 
//   // url = "https://rj.tomtompodcast.com/api/token/"; // QA 
//   // url = "https://ec2-34-197-255-9.compute-1.amazonaws.com/api/token/"; //QA 
//   url = "https://qa.tomtompodcast.com/api/token/"; // QA 
// }

// let resetToken = function(){
//   if (!localStorage.getItem('rjttptoken')) {
//     fetch(url + 'generate').then(response => {
//       // handle the response
//       response.json().then(data => {
//         localStorage.setItem('rjttptoken', data.Response);          
//       })
//     }).catch(error => {
//       // handle the error
//       console.log("token Error");
//     });
//   }  
// }

// fetch(url + 'refresh').then(response => {
//   // handle the response
//   response.json().then(data => {
//     if(data.Response == 2){
//       localStorage.removeItem('rjttptoken');
//       localStorage.removeItem('user_data');
//       resetToken();
//     }      
//   })
// }).catch(error => {
//   console.log("token Error");
// });

// resetToken();


// setTimeout(()=>{
// },1000);
platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));


