import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthGuard } from './auth-guard.service';

@Injectable()
export class FavoriteService {
  constructor(private http: Http, private auth: AuthGuard){}

  addFavorite(stockId:string): Promise<Response> {
    const user = this.auth.getUser();
    let headers = new Headers({'Authorization' : user.token, 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/favorite/add', { stock: stockId, user: user.id}, options)
      .toPromise();
  }
}
