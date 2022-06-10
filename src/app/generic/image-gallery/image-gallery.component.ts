import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PorcastService } from 'src/app/private/porcast.service';

@Component({
  selector: 'app-image-gallery',
  templateUrl: './image-gallery.component.html',
  styleUrls: ['./image-gallery.component.scss']
})
export class ImageGalleryComponent implements OnInit {
  @Output() back = new EventEmitter();
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
selectedpic(image){
  //this.ps.IsImageGallaryVisible = false;
if(image == 'close'){
  this.back.emit({'type': "close", 'value': ''});
}else{
  this.back.emit({'type': "image", 'value': image});
}
}
}
