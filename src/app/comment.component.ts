import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Comment } from './models/comment';
import { User } from './models/user';
import { CommentService } from './services/comment.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import 'rxjs/Rx';


import * as io from "socket.io-client";
import { AuthGuard } from './services/auth-guard.service';



@Component({
  selector: 'comment-component',
  templateUrl: './html/comment.component.html',
  styles: ['../styles.css'],
  providers: [CommentService]
})

export class CommentComponent implements OnInit, OnDestroy {
  @Input() stockId;
  socket:any;
  comments: Comment[] = [];
  typers: User[] = [];
  private commentStream;
  private typingStream;
  private commentForm: FormGroup;
  private token;

  constructor(private commentService: CommentService, private formBuilder: FormBuilder, private auth: AuthGuard){
    this.token = this.auth.getUser();
  }

  ngOnInit(){
    this.commentService.getComments(this.stockId)
      .then((res)=>{
          this.comments = [];
          console.log(res.json());
          res.json().forEach((comment)=>{
            console.log(comment);
            this.comments.push(new Comment(comment.author, comment.content, comment.stock, comment.createdAt));
          });
        })
        .catch((err)=>{
          console.log(err);
        });

        this.commentStream = this.commentService.getCommentStream(this.stockId)
          .subscribe(
            comment=> {
              this.comments.push(comment);
            },
            error=> console.log(error),
            () => console.log("finished")
          );

          this.commentForm = this.formBuilder.group({
             commentContent: []
          });
          this.typingStream = this.commentService.getTypingStream(this.stockId)
            .subscribe(
              (user)=>{
                  if(!this.inArray(user['id']) && user['add'] && user['id'] !== this.token.id) { //&& user['id'] !== this.token.id)
                      this.typers.push(new User(user['email'], user['name'], user['id']));
                  }else if(!user['add']){
                    this.removeWithId(user['id']);
                  }
              },
              (error)=>console.log(error)
            );
          this.commentForm.valueChanges
              .throttleTime(1000)
              .do(()=>
                {
                  console.log("typing");
                  this.commentService.isTyping({id: this.auth.getUser().id, name: this.auth.getUser().name, stock:this.stockId});
                })
              .debounceTime(1200)
              .subscribe(()=>{
                console.log("done typing");
                this.commentService.stoppedTyping({id: this.auth.getUser().id, name: this.auth.getUser().name, stock:this.stockId});
              }
              );




        /*  this.commentForm.valueChanges.sampleTime(1000).do(()=>{
            console.log("typing");
            console.log(this.auth.getUser());
            this.commentService.isTyping({id: this.auth.getUser().id, name: this.auth.getUser().name, stock:this.stockId});
          })
          .debounceTime(1000)
          .subscribe(()=>{
            console.log("done typing");
            this.commentService.stoppedTyping({id: this.auth.getUser().id, name: this.auth.getUser().name, stock:this.stockId});
          },
          err=>console.log(err)
        );*/


      }
      ngOnDestroy(){
        this.commentStream.unsubscribe();
        this.typingStream.unsubscribe();
      }


  inArray(id){
    for(let i = 0;i < this.typers.length; ++i){

      if(this.typers[i].id===id) {
        console.log("trueeee");
        return true;
      }
    }
    return false;
  }
  removeWithId(id){
    for(let i = 0;i < this.typers.length; ++i){
      if(this.typers[i].id===id){
        console.log("remove");
        this.typers.splice(i,1);
      }
    }
  }

  postComment(post){
    this.commentForm.reset();
    console.log(post.commentContent);
    this.commentService.postComment({author:this.token.name, content:post.commentContent, stock:this.stockId})
      .then(function(res){
        console.log("Comment added");
      })
      .catch(function(err){
        console.log(err);
      });
  }
}
