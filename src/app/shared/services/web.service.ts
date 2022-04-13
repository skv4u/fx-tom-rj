import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ConfigurationMicroService } from './configuration-micro.service';
@Injectable({
    providedIn: 'root'
})
export class WebService {
    APIUrl: any = {};
    constructor(public http: HttpClient, public configurationService: ConfigurationMicroService) {
        this.APIUrl = this.configurationService.getUrl();
    }



    commonMethod(url: string, data: any, method?: string, url_type?: string): any {
        method = method ? method : 'POST';
        url_type = url_type ? url_type : 'DEV';
        let headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Authorization':'Bearer ' + localStorage.getItem('rjttptoken')
        })
        let endPoint = this.APIUrl[url_type] + "/" + url;
        if (method == 'POST')
            return this.http.post(endPoint, data, { headers });
        else if (method == 'GET')
            return this.http.get(endPoint, { headers });
        else if (method == 'PUT')
            return this.http.put(endPoint, data, { headers });
        else if (method == 'DELETE') {
            const options = {
                headers: headers,
                body: data
            };
            return this.http.delete(endPoint, options);
        }
    }

    UploadDocument(url: string, data: any) {
        let headers = {
          headers: new HttpHeaders({
            'enctype': 'multipart/form-data',
            'Authorization':'Bearer ' + localStorage.getItem('rjttptoken')
          })
        };
        return this.http.post(this.APIUrl.DEV + '/' + url, data, headers);
    
      }

      UploadDocument1(url: string, data: any) {
        const headers = new HttpHeaders({
          'enctype': 'multipart/form-data',
          'Authorization':'Bearer ' + localStorage.getItem('rjttptoken')
        });
        return this.http.post(this.APIUrl.DEV + '/' + url, data, {
          headers,
          reportProgress: true,
          observe: 'events'
        });
      }

      DeleteDocument(url: string, filename: string, method?: string) {
        method = method ? method : 'POST';
      //  url_type = url_type ? url_type : this.default_url_type;
        let headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization':'Bearer ' + localStorage.getItem('rjttptoken')
        })
        let endPoint = this.APIUrl["DEV"] + "/" + url;
        if (method == 'POST')
          return this.http.post(endPoint, '"' + filename + '"', { headers: headers });
      }


}