import { Component, OnInit } from '@angular/core';
import { PorcastService } from 'src/app/private/porcast.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {

  constructor(public ps:PorcastService) { }

  ngOnInit() {
  }
  getImageName(img){
    if(img){
      let str = img.substring(img.lastIndexOf("/")+1);
      return str.substring(str.indexOf("_")+1);
    }
    return '';
  }

}
