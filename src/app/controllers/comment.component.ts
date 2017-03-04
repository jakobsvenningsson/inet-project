import { Component, Input, OnInit, OnDestroy} from '@angular/core';
import { Comment } from '../models/comment';
import { User } from '../models/user';
import { CommentService } from '../services/comment.service';
import { FormBuilder, FormGroup } from '@angular/forms'
import 'rxjs/Rx';
import * as io from "socket.io-client";
import { AuthGuard } from '../services/auth-guard.service';


@Component({
  selector: 'comment-component',
  templateUrl: '../html/comment.component.html',
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
          const user = this.auth.getUser();
          res.json().forEach((comment)=>{
            console.log(comment);
            if(comment.userId === String(user.id)){
              this.comments.push(new Comment(comment.user.name, comment.content, comment.stockId, comment.createdAt,comment.id, true));
            }else {
              this.comments.push(new Comment(comment.user.name, comment.content, comment.stockId, comment.createdAt,comment.id,false));
            }
          });
        })
        .catch((err)=>{
          console.log(err);
        });

        this.commentStream = this.commentService.getCommentStream(this.stockId)
          .subscribe(
            comment=> {
              if(comment.author){
                this.comments.push(comment);
              } else {
                this.removeWithId2(comment.id, this.comments);
              }
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
                  console.log("-------");
                  console.log(user);
                  console.log(this.token);
                  console.log("-------");
                  if(!this.inArray(user['userId']) && (user['add'] && user['userId'] !== this.token.id)) { //&& user['id'] !== this.token.id)&& user['userId'] !== this.token.id)
                      console.log("ADD");
                      this.typers.push(new User("user['email']", user['name'], user['userId']));
                  }else if(!user['add']){
                    console.log("REMOVE");
                    this.removeWithId(user['userId']);
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

  removeWithId2(id, list){
    for(let i = 0;i < list.length; ++i){
      if(list[i].id===id){
        console.log("remove");
        list.splice(i,1);
      }
    }
  }

  postComment(post){
    console.log(post);
    this.commentForm.reset();
    console.log(post.commentContent);
    this.commentService.postComment({userId:this.token.id, content:post.commentContent, stockId:this.stockId})
      .then(function(res){
        console.log("Comment added");
      })
      .catch(function(err){
        console.log(err);
      });
  }

  removeComment(comment:Comment){
    console.log(comment);
    this.commentService.deleteComment(comment)
      .then(function(data){
        console.log(data);
      })
      .catch(function(err){
        console.log(err);
      });
  };
}
