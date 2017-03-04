import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import {AuthGuard } from './auth-guard.service';
import { Observable } from 'rxjs/Observable';
import * as io from "socket.io-client";
import { Favorite } from '../models/favorite';

@Injectable()
export class FavoriteService {
  private socket;

  constructor(private http: Http, private auth: AuthGuard){
    this.socket = io.connect("http://localhost:3000");
  }

  addFavorite(stockId: number): Promise<Response> {
    const user = this.auth.getUser();
    const headers = new Headers({'Authorization' : user.token, 'Content-Type' : 'application/json'});
    const options = new RequestOptions({ headers: headers });
    return this.http.post('/api/favorite/add', { stockId: stockId, userId: user.id}, options)
      .toPromise();
  }

  getFavorites(): Promise<Response> {
    const user = this.auth.getUser();
    const headers = new Headers({'Authorization' : user.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/favorite/get/' + user.id, options)
      .toPromise();
  }

  removeFavorite(stockId: number): Promise<Response> {
    const user = this.auth.getUser();
    const headers = new Headers({'Authorization' : user.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.delete('/api/favorite/remove/' + user.id + '/' + stockId, options)
      .toPromise();
  }

  getTopList(): Promise<Response> {
    const user = this.auth.getUser();
    const headers = new Headers({'Authorization' : user.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/favorite/', options)
      .toPromise();
  }

  favoriteStream(): Observable<Favorite>{
    const user = this.auth.getUser();
    return new Observable(observer=>{
      this.socket.emit("joinFavorites", {user: user.id});
      console.log("listening");
      this.socket.on("addFavorite", (data) => {
        observer.next(new Favorite(data.userId, data.stockId, true));
      });
      this.socket.on("removeFavorite", (data) => {
        observer.next(new Favorite(data.userId, data.stockId, false));
      });
    });
  }
}
