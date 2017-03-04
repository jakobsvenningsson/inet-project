import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class UserService {
  constructor(private http: Http){}
  submitLogin(email:string, password:string): Promise<Response> {
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/login', { email: email, password: password }, options)
      .toPromise();
  }

  submitRegister(email: string,  name: string, password: string): Promise<Response> {
    let headers = new Headers({'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/register', { email: email, name: name, password: password }, options)
      .toPromise();
  }
}
