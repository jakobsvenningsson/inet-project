import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthGuard } from './auth-guard.service';
import { Observable } from 'rxjs/Observable';
import * as io from "socket.io-client";

@Injectable()
export class FavoriteService {
  private socket;
  constructor(private http: Http, private auth: AuthGuard){
    this.socket = io.connect("http://localhost:3000");
  }

  addFavorite(stockId:string): Promise<Response> {
    const user = this.auth.getUser();
    console.log(user);

    let headers = new Headers({'Authorization' : user.token, 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/favorite/add', { stockId: stockId, userId: user.id}, options)
      .toPromise();
  }
  getFavorites(): Promise<Response> {
    const user = this.auth.getUser();
    console.log(user);
    let headers = new Headers({'Authorization' : user.token});
    let options = new RequestOptions({ headers: headers });
    return this.http.get('/api/favorite/get/' + user.id, options)
      .toPromise();
  }
  removeFavorite(stockId): Promise<Response> {
    const user = this.auth.getUser();
    console.log(user);
    let headers = new Headers({'Authorization' : user.token, 'Content-Type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
    return this.http.post('/api/favorite/remove/', {stockId: stockId, userId:user.id}, options)
      .toPromise();
  }
  getTopList(): Promise<Response> {
    const user = this.auth.getUser();
    let headers = new Headers({'Authorization' : user.token});
    let options = new RequestOptions({ headers: headers });
    return this.http.get('/api/favorite/', options)
      .toPromise();
  }
  favoriteStream(): Observable<any>{
    const user = this.auth.getUser();
    return new Observable(observer=>{
      this.socket.emit("joinFavorites", {user:user.id});
      console.log("listening");
      this.socket.on("addFavorite", function(data){
        observer.next({favorite:true, user:data.userId, stock:data.stockId});
      });
      this.socket.on("removeFavorite", function(data){
        observer.next({favorite:false, user:data.userId,  stock:data.stockId});
      });
    });
  }
}
