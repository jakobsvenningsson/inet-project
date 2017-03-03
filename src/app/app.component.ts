import { Component } from '@angular/core';
import * as io from "socket.io-client";
import { RouterLink } from '@angular/router';
import { AuthGuard } from './services/auth-guard.service';

@Component({
  selector: 'app-root',
  templateUrl: './html/app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(private auth: AuthGuard){
    if (auth.isLoggedIn()) {
      console.log("logged in");
      console.log(auth.getUser());
    }
  }
  test(){
    console.log(this.auth.isLoggedIn());
    console.log(this.auth.getUser());
    console.log(typeof(this.auth.getUser()));
    console.log(sessionStorage.getItem("currentUser"));
    if(sessionStorage.getItem("currentUser")){
      console.log("AWDAWDAWD");
    }
  }
}
