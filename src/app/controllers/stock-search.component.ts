import { Component } from '@angular/core';
import { StockService} from '../services/stock.service';
import { Stock } from '../models/stock';

@Component({
  selector: 'stock-search.component',
  templateUrl: '../html/stock-search.component.html',
  providers: [StockService]
})

export class StockSearchComponent {

  searchString: string = "";
  result:Stock[] = [];

  constructor(private stockService: StockService){}

  addToDatabase(stock: Stock) {
    this.stockService.addStockToDatabase(stock)
      .then((res) => {
        console.log("Added stock to database");
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  getStocks() {
    this.stockService.searchStocks(this.searchString)
      .then((data) => {
        this.result = [];
        data.json().ResultSet.Result.forEach((stock) => {
          if(stock.exchDisp === "NASDAQ" || stock.exchDisp === "NYSE"){
            this.result.push(new Stock(stock.name, stock.symbol, stock.exchDisp, stock.id));
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }
}
