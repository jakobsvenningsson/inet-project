export class Favorite{
  userId: number;
  stockId: number;
  add: boolean = false;
  constructor(userId: number, stockId: number, add?: boolean){
    this.userId = userId;
    this.stockId = stockId;
    this.add = add;
  }
}
