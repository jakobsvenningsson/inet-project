import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

  private token = null;

  constructor(private router: Router) {
    if(sessionStorage.getItem("currentUser")){
      console.log("loggggging in");
      this.token = JSON.parse(sessionStorage.getItem("currentUser"));
    }
  }


  canActivate() {
    // If user is not logged in we'll send them to the homepage
    console.log(typeof(sessionStorage.getItem('currentUser')));
    if (sessionStorage.getItem('currentUser')){
      return true;
    }
    this.router.navigateByUrl('/unautherized');
    return false;
  }

  isLoggedIn(){
    if (sessionStorage.getItem("currentUser") != null) {
      return true;
    }
    return false;
  }

  setUser(user){
    this.token = user;
    console.log(user);
  }

  getUser(){
    return this.token;
  }

  logout(){
    sessionStorage.removeItem("currentUser");
    this.token = null;
  }
}
