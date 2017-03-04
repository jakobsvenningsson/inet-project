export class Comment{
  author:number;
  content:string;
  stock: number;
  timestamp:string;
  owner:boolean = false;
  id:number;
  constructor(author:number, content: string, stockId: number, timestamp: string, id:number,owner?:boolean){
    this.author = author;
    this.content = content;
    this.stock = stockId;
    this.timestamp = timestamp;
    this.owner = owner;
    this.id = id;
  }
}
