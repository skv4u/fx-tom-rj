import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  isUserSelected:boolean = false;
  search:string = "";
  userList:any[]=[
    {
      "mob_email":"santosh@gmail.com",
      "mob_mobile":"9898989766",
      "mob_name":"Santosh",
      "profile_image":"./assets/images/logo.jpg",
      "unread_count":"10",
      "last_viewed":"3 min ago",
      "last_message":""
    },
    {
      "mob_email":"shankar@gmail.com",
      "mob_mobile":"9898989767",
      "mob_name":"Shankar",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"2",
      "last_viewed":"3 day ago",
      "last_message":""
    },
    {
      "mob_email":"manish@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Manish",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"4 day ago",
      "last_message":""
    },
    {
      "mob_email":"anil@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Anil",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"2 min ago",
      "last_message":""
    },
    {
      "mob_email":"santosh@gmail.com",
      "mob_mobile":"9898989766",
      "mob_name":"Santosh",
      "profile_image":"./assets/images/logo.jpg",
      "unread_count":"10",
      "last_viewed":"3 min ago",
      "last_message":""
    },
    {
      "mob_email":"shankar@gmail.com",
      "mob_mobile":"9898989767",
      "mob_name":"Shankar",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"2",
      "last_viewed":"3 day ago",
      "last_message":""
    },
    {
      "mob_email":"manish@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Manish",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"4 day ago",
      "last_message":""
    },
    {
      "mob_email":"anil@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Anil",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"2 min ago",
      "last_message":""
    },
    {
      "mob_email":"santosh@gmail.com",
      "mob_mobile":"9898989766",
      "mob_name":"Santosh",
      "profile_image":"./assets/images/logo.jpg",
      "unread_count":"10",
      "last_viewed":"3 min ago",
      "last_message":""
    },
    {
      "mob_email":"shankar@gmail.com",
      "mob_mobile":"9898989767",
      "mob_name":"Shankar",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"2",
      "last_viewed":"3 day ago",
      "last_message":""
    },
    {
      "mob_email":"manish@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Manish",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"4 day ago",
      "last_message":""
    },
    {
      "mob_email":"anil@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Anil",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"2 min ago",
      "last_message":""
    },{
      "mob_email":"santosh@gmail.com",
      "mob_mobile":"9898989766",
      "mob_name":"Santosh",
      "profile_image":"./assets/images/logo.jpg",
      "unread_count":"10",
      "last_viewed":"3 min ago",
      "last_message":""
    },
    {
      "mob_email":"shankar@gmail.com",
      "mob_mobile":"9898989767",
      "mob_name":"Shankar",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"2",
      "last_viewed":"3 day ago",
      "last_message":""
    },
    {
      "mob_email":"manish@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Manish",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"4 day ago",
      "last_message":""
    },
    {
      "mob_email":"anil@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Anil",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"2 min ago",
      "last_message":""
    },{
      "mob_email":"santosh@gmail.com",
      "mob_mobile":"9898989766",
      "mob_name":"Santosh",
      "profile_image":"./assets/images/logo.jpg",
      "unread_count":"10",
      "last_viewed":"3 min ago",
      "last_message":""
    },
    {
      "mob_email":"shankar@gmail.com",
      "mob_mobile":"9898989767",
      "mob_name":"Shankar",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"2",
      "last_viewed":"3 day ago",
      "last_message":""
    },
    {
      "mob_email":"manish@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Manish",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"4 day ago",
      "last_message":""
    },
    {
      "mob_email":"anil@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Anil",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"2 min ago",
      "last_message":""
    },{
      "mob_email":"santosh@gmail.com",
      "mob_mobile":"9898989766",
      "mob_name":"Santosh",
      "profile_image":"./assets/images/logo.jpg",
      "unread_count":"10",
      "last_viewed":"3 min ago",
      "last_message":""
    },
    {
      "mob_email":"shankar@gmail.com",
      "mob_mobile":"9898989767",
      "mob_name":"Shankar",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"2",
      "last_viewed":"3 day ago",
      "last_message":""
    },
    {
      "mob_email":"manish@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Manish",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"4 day ago",
      "last_message":""
    },
    {
      "mob_email":"anil@gmail.com",
      "mob_mobile":"9898989762",
      "mob_name":"Anil",
       "profile_image":"./assets/images/logo.jpg",
      "unread_count":"",
      "last_viewed":"2 min ago",
      "last_message":""
    }
  ]

  messagelist:any[]=[
    {"user_id":"", "mob_user_id":"1","message":"This is my dummy text","time":"3 min ago"},
    {"user_id":"1", "mob_user_id":"","message":"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero nihil sint quod fugit molestiae non, iste nesciunt quibusdam impedit reiciendis optio culpa hic enim quam, minima facere illo ratione officiis.","time":"3 min ago"},
    {"user_id":"1", "mob_user_id":"","message":"  Lorem ciunt quibusdam impedit reiciendis optio culpa hic enim quam, minima facere illo ratione officiis.","time":"2 min ago"},
    
    {"user_id":"", "mob_user_id":"1","message":"  Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero nihil sint quod fugit molestiae non, iste nesciunt quibusdam impedit reiciendis optio culpa hic enim quam, minima facere illo ratione officiis.","time":"3 min ago"},
    {"user_id":"1", "mob_user_id":"","message":"  Lorem ipsumo ratione officiis.","time":"2 sec ago"},
    {"user_id":"", "mob_user_id":"1","message":"  Lorem ipsumo ratione officiis.","time":"2 sec ago"},
    {"user_id":"", "mob_user_id":"1","message":"  Lorem ipsumo ratione officiis.","time":"2 sec ago"},
    {"user_id":"", "mob_user_id":"1","message":"  Lorem ipsumo ratione officiis.","time":"2 sec ago"},
    {"user_id":"1", "mob_user_id":"","message":"  Lorem ipsumo ratione officiis. Lorem ipsumo ratione officiis.","time":"2 sec ago"},
  ]
  selectedData:any = {};
  constructor() { }

  ngOnInit() {
   
  }
  loadChatforUser(elem:any){
    this.selectedData = elem;
    this.isUserSelected = true;
  }
}
