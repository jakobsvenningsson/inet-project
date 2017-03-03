import { Injectable } from '@angular/core';

@Injectable()
export class TokenService {
  constructor(){console.log("TOKENSERVICCE");}
  isLoggedIn(){
    if (sessionStorage.getItem("currentUser") !== null) {
      console.log(sessionStorage.getItem("currentUser"));
    }
  }
}
