import { Component } from '@angular/core';
import { StockService} from './services/stock.service';
import { FavoriteService } from './services/favorite.service';
import { Stock } from './models/stock';
import { AuthGuard } from './services/auth-guard.service';

@Component({
  selector: 'stock-list-component',
  templateUrl: './html/stock-list.component.html',
  providers: [StockService, FavoriteService],
  styles: ['../styles.css']
})

export class StockListComponent{
  stocks:Stock[];
  constructor(private stockService:StockService, private auth: AuthGuard,  private favoriteService: FavoriteService){
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
  makeFavorite(stock:Stock){
    console.log(stock);
    const user = this.auth.getUser();
    this.favoriteService.addFavorite(stock.id)
      .then((data)=>{
        console.log(data);
        console.log("favorite added");
      })
      .catch((err)=>{
        console.log(err);
      })
  }
}
