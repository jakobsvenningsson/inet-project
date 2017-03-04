import { Component, Output, EventEmitter } from '@angular/core';
import { UserService } from '../services/user.service';
import { User } from '../models/user';

@Component({
  selector: 'register-component',
  templateUrl: '../html/register.component.html',
  providers: [UserService]
})


export class RegisterComponent {

  email: string;
  name: string;
  password: string;

  @Output() toggleForms: EventEmitter<boolean> = new EventEmitter();
  @Output() errorEmitter: EventEmitter<string> = new EventEmitter();
  @Output() success: EventEmitter<User> = new EventEmitter();


  constructor(private userService: UserService){}

  register(){
    this.userService.submitRegister(this.email, this.name, this.password)
      .then(
        user => {
          this.success.emit(new User(this.email, this.name, null));
        },
        error => {
          this.errorEmitter.emit(error.text());
        }
      );
  }
  showLoginForm(){
    this.toggleForms.emit();
  }
}
