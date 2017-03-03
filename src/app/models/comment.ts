export class Comment{
  author:string;
  content:string;
  stock: string;
  timestamp:string;
  constructor(author:string, content: string, stockId: string, timestamp: string){
    this.author = author;
    this.content = content;
    this.stock = stockId;
    this.timestamp = timestamp;
  }
}
