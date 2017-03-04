export class Stock{
  id:number;
  symbol:string;
  name:string;
  exchange:string;
  favorite?:boolean = false;
  constructor(name:string, symbol:string, exchange: string, id:number, favorite = false){
    this.symbol = symbol;
    this.name = name;
    this.exchange = exchange;
    this.id = id;
    this.favorite = favorite;
  }
}
