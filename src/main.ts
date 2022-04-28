import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}
if (!localStorage.getItem('rjttptoken')) {
 let  PROTOCOL: string = window.location.host.includes("localhost") ? 'http:' : window.location.protocol;
  let url = window.location.origin+'/api/token/generate';
  if(window.location.host.includes("localhost")){
    // url = "http://ec2-15-207-52-38.ap-south-1.compute.amazonaws.com/api/token/generate"; // Prod 
    url = "http://ec2-34-197-255-9.compute-1.amazonaws.com/api/token/generate"; //QA 
  }
  fetch(url).then(response => {
    // handle the response
    response.json().then(data => {
      localStorage.setItem('rjttptoken', data.Response)
        
    })
  }).catch(error => {
    // handle the error
    console.log("token Error");
  });
} 
setTimeout(()=>{
  platformBrowserDynamic().bootstrapModule(AppModule).catch(err => console.error(err));
},1000);


