import { Component, OnInit, Input} from '@angular/core';
import { PorcastService } from 'src/app/private/porcast.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {

  @Input('msg') msg?:string = 'Loading...';
  constructor(public _podService: PorcastService) { }

  ngOnInit() {
  }

}
