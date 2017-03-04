export class Favorite{
  userId: number;
  stockId: number;
  isFavorite: boolean = false;
  constructor(userId: number, stockId: number, isFavorite?: boolean){
    this.userId = userId;
    this.stockId = stockId;
    this.isFavorite = isFavorite;
  }
}
