import { Component, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { RegisterComponent } from './register.component';
import { User } from '../models/user';



@Component({
  selector: 'login-component',
  templateUrl: '../html/login.component.html',
  providers:[UserService]
})
export class LoginComponent {

  email: string;
  password: string;
  display:boolean;
  constructor(private userService: UserService, private router: Router){}

  @Output() success: EventEmitter<User> = new EventEmitter();
  @Output() toggleForms: EventEmitter<boolean> = new EventEmitter();
  @Output() errorEmitter: EventEmitter<String> = new EventEmitter();

  showRegisterForm(){
    this.toggleForms.emit();
  }

   sendLoginStatus(status) {
       this.success.emit(status);
   }

  login(){
    this.userService.submitLogin(this.email, this.password)
      .then(
        user => {
          let obj = user.json();
          sessionStorage.setItem("currentUser", JSON.stringify(obj));
          this.sendLoginStatus(obj);
        },
        error => {
          console.log(error.text());
          this.errorEmitter.emit(error.text());
        }
      )
  }
}
