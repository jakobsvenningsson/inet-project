import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Comment } from '../models/comment';
import * as io from "socket.io-client";
import { AuthGuard } from './auth-guard.service';

@Injectable()
export class CommentService {

  private socket;
  constructor(private http: Http, private auth: AuthGuard){
    this.socket = io.connect("http://localhost:3000");
  }

  postComment(comment: Object): Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization' : authToken.token });
    const options = new RequestOptions({ headers: headers });
    return this.http.post('/api/comments/submit', comment, options)
      .toPromise();
  }

  getComments(stockId: number): Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization' : authToken.token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/comments/' + stockId, options)
      .toPromise();
  }

  getCommentStream(stockId: number): Observable<Comment> {
    return new Observable(observer=> {
      const user = this.auth.getUser().id;
      this.socket.emit("join", {channel: stockId});
      this.socket.on('newComment', function(comment) {
        let owner = user === comment.userId ? true : false;
        observer.next(new Comment(comment.name, comment.content, comment.stockId, comment.timestamp, comment.id, owner));
      });
      this.socket.on('deleteComment', function(comment) {
        observer.next(new Comment(null, null, comment.stockId, null, comment.id, false));
      });
    });
  }

  getTypingStream(stockId: number): Observable<Object> {
    return new Observable(observer => {
      this.socket.on('startTyping', function(user) {
        observer.next({add:true, name:user.name, userId: user.id});
      });
      this.socket.on('stopTyping', function(user) {
        observer.next({add:false, name:user.name, userId: user.id});
      });
    });
  }

  isTyping(obj: Object) {
    this.socket.emit('startTyping', obj);
  }

  stoppedTyping(obj: Object) {
    this.socket.emit('stopTyping', obj);
  }

  deleteComment(comment: Comment):Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization' : authToken.token });
    const options = new RequestOptions({ headers: headers });
    return this.http.delete('/api/comments/delete/' + comment.id, options)
      .toPromise();
  }
}
