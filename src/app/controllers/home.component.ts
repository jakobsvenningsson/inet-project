import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from './register.component';
import { LoginComponent } from './login.component';
import { User } from '../models/user';
import { AuthGuard } from '../services/auth-guard.service';


@Component({
  selector: 'home',
  templateUrl: '../html/home.component.html'
})
export class HomeComponent {
  private token;
  loggedIn:boolean = false;
  register:boolean = false;
  formError:string = "";
  registerStatus:string="";

  constructor(private router:Router, private auth: AuthGuard){}

  ngOnInit(){
    if(this.auth.isLoggedIn()){
      this.token = this.auth.getUser();
      console.log(this.token);
    }
  }

  setLoginStatus(user){
    if(user){
      this.auth.setUser(user);
      this.token = user;
      this.registerStatus = "";
      this.formError = "";
    }
  }
  setError(error:string){
    this.formError = error;
  }

  toogleForms(){
    this.registerStatus="";
    this.formError = "";
    this.register = (this.register === false ? true : false);
  }

  setRegisterStatus(user:User){
    this.register = false;
    this.formError = "";
    this.registerStatus = `Registered account with email address ${user.email}`;
  }

  logout(){
    this.auth.logout();
    this.token = null;
  }
}
