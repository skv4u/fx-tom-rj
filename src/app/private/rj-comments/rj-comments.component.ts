import { Component, OnInit } from '@angular/core';
import { LocalstorageService } from 'src/app/shared/services/localstorage.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { WebService } from 'src/app/shared/services/web.service';
import { PorcastService } from '../porcast.service';

@Component({
  selector: 'app-rj-comments',
  templateUrl: './rj-comments.component.html',
  styleUrls: ['./rj-comments.component.scss']
})
export class RjCommentsComponent implements OnInit {

  CommentsList: any = [];
  commentText: any;
  replycomment: string = ""
  showplayer: boolean = false;
  postCommentVisible: boolean = false;
  constructor(public prodcastService: PorcastService, public webService: WebService, public LocalStorage: LocalstorageService, public toaster: ToastService) { }

  ngOnInit() {
    this.prodcastService.isListPage = false;
    this.prodcastService.iscreatebuttonVisiable = false;
    this.getCommentList();
  }
  getCommentList() {
    this.CommentsList = [];
    this.prodcastService.loader = true;
    let req = {
      "podcast_id": this.prodcastService.podcastListData.id,
      "user_id": this.LocalStorage.getUserData().id
    };
    this.webService.commonMethod('mobuser/podcast/commentreplylist', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        this.CommentsList = data.Response;
        for (let a of this.CommentsList) {
          a.replycomment = "";
        }
        this.showplayer = true;
      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
      // ,err => {
      // }
    )
  }

  LikeandHeart(id, type) {
    this.prodcastService.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id,
      "type": type,
      "created_by": this.LocalStorage.getUserData().username
    }

    this.webService.commonMethod('podcast/commentldh', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        if (data.Status == "Success" && data.Response)
          this.getCommentList();

      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  replyComment(i, id, comment) {
    if (!comment.trim().length) {
      this.toaster.error('Please add reply');
      return
    }
    this.prodcastService.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id,
      "description": comment
    };
    this.webService.commonMethod('podcast/comment/reply', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        if (data.Status == 'Success' && data.Response != '') {
          this.CommentsList[i].replycomment = "";
          this.CommentsList = data.Response;
          this.getCommentList();
        }
      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  createCommets() {
    // console.log("commentText", this.commentText);
    let elem: any = <HTMLMapElement>document.getElementById('commenttext');
    let commentHTML = elem.innerHTML;
    if (!elem.innerText.trim().length) {
      this.toaster.error('Please add comment');
      return
    }

    this.prodcastService.loader = true;
    let req = {
      "podcast_id": this.prodcastService.podcastListData.id,
      "user_id": this.LocalStorage.getUserData().id,
      "description": commentHTML,
      "filepath": "",
      "created_by": this.LocalStorage.getUserData().username
    };
    this.webService.commonMethod('podcast/comment', req, 'POST').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        this.commentText = "";
        document.getElementById('commenttext').innerHTML = "";
        this.getCommentList();
        // this.CommentsList=data.Response;
      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
    )
  }


  deleteCommets(id) {
    this.prodcastService.loader = true;
    let req = {
      "comment_id": id,
      "user_id": this.LocalStorage.getUserData().id
    }
    this.webService.commonMethod('mobuser/comment', req, 'DELETE').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        if (data.Status == 'Success' && data.Response)
          this.getCommentList();
      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
    )
  }
  deleteReply(id) {
    this.prodcastService.loader = true;
    let req = {
      "reply_id": id,
      "user_id": this.LocalStorage.getUserData().id
    }
    this.webService.commonMethod('mobuser/comment/reply', req, 'DELETE').subscribe(
      (data) => {
        this.prodcastService.loader = false;
        if (data.Status == 'Success' && data.Response)
          this.getCommentList();
      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
    )
  }

  replyldh(id, type) {
    this.prodcastService.loader = true;
    let req = {
      "reply_id": id,
      "user_id": this.LocalStorage.getUserData().id,
      "type": type,
    }

    this.webService.commonMethod('mobuser/podcast/replyldh', req, 'POST').subscribe(
      (data) => {
        console.log(data);
        this.prodcastService.loader = false;
        if (data.Status == "Success" && data.Response)
          this.getCommentList();
      }, err => {
        if (err.status === 401) {
          this.prodcastService.loader = false;
          this.prodcastService.TokenExpied();
        }
      }
    )
  }
}
