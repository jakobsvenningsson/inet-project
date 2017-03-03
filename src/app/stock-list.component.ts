import { Component } from '@angular/core';
import { StockService} from './services/stock.service';
import { Stock } from './models/stock';

@Component({
  selector: 'stock-list-component',
  templateUrl: './html/stock-list.component.html',
  providers: [StockService],
  styles: ['../styles.css']
})

export class StockListComponent{
  stocks:Stock[];
  constructor(private stockService:StockService){
    stockService.getStocks()
      .then((data)=>{
        console.log(data);
        this.stocks = [];
        data.json().forEach((stock)=>{
          this.stocks.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id));
        });
      }).catch((err)=>{
        console.log(err);
      });
  }

  showStock(stock:Stock){
    console.log(stock);
  }
}
