export class Stock{
  id:string;
  symbol:string;
  name:string;
  exchange:string;
  constructor(name:string, symbol:string, exchange: string, id:string){
    this.symbol = symbol;
    this.name = name;
    this.exchange = exchange;
    this.id = id;
  }
}
