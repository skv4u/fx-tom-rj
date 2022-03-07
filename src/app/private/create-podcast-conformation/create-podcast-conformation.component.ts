import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';

@Component({
  selector: 'app-create-podcast-conformation',
  templateUrl: './create-podcast-conformation.component.html',
  styleUrls: ['./create-podcast-conformation.component.scss']
})
export class CreatePodcastConformationComponent implements OnInit {

  constructor(public _localStorage: LocalstorageService) { }

  ngOnInit() {
  }

}
