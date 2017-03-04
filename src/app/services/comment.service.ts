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
  postComment(comment:Object): Promise<Response>{
    const authToken = this.auth.getUser();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization' : authToken.token });
    const options = new RequestOptions({ headers: headers });
    return this.http.post('/api/comments/submit', comment, options)
      .toPromise();
  }
  getComments(stockId:string): Promise<Response>{
    const authToken = this.auth.getUser();
    const headers = new Headers({ 'Content-Type': 'application/json', 'Authorization' : authToken.token });
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/comments/' + stockId, options)
      .toPromise();
  }
  getCommentStream(stockId:string): Observable<Comment>{
    return new Observable(observer=>{
      this.socket.emit("join", {channel: stockId});
      this.socket.on('newComment', function(comment){
        console.log("asocket comment");
        observer.next(new Comment(comment.author, comment.content, comment.stock, comment.createdAt));
      });
    });
  }
  getTypingStream(stockId:string): Observable<Object>{
    return new Observable(observer=>{
      this.socket.on('startTyping', function(user){
      //  console.log(user);
        observer.next({add:true, name:user.name, id: user.id});
      });
      this.socket.on('stopTyping', function(user){
      //  console.log(user);
        observer.next({add:false, name:user.name, id: user.id});
      });
    });
  }
  isTyping(obj: Object){
  //  console.log(obj);
    this.socket.emit('startTyping', obj);
  }
  stoppedTyping(obj: Object){
  //  console.log(obj);

    this.socket.emit('stopTyping', obj);
  }
}
