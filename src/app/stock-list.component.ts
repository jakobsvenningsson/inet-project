import { Component, OnInit } from '@angular/core';
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

export class StockListComponent implements OnInit{
  stocks:Stock[] = [];
  constructor(private stockService:StockService, private auth: AuthGuard,  private favoriteService: FavoriteService){}
ngOnInit(){
  Promise.all([this.stockService.getStocks(), this.favoriteService.getFavorites()])
    .then((values)=>{
      values[0].json().forEach((stock)=>{
        if(values[1].json().length && values[1].json().find( favorite => favorite.stockId === String(stock.id))){
          this.stocks.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id, true));
        } else {
          this.stocks.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id));
        }
      });
    })
    .catch((err)=>{
      console.log(err);
    });

    this.favoriteService.favoriteStream()
      .subscribe((data)=>{
          this.updateFavoriteList(data);
      });
}

  updateFavoriteList(data){
    for(let i = 0; i < this.stocks.length; ++i){
      if(Number(data.stock) === Number(this.stocks[i].id)){
        this.stocks[i].favorite = data.favorite;
        console.log(this.stocks[i].favorite );
      }
    }
  }

  showStock(stock:Stock){
  }
  makeFavorite(stock:Stock){

    if(stock.favorite){
      this.favoriteService.removeFavorite(stock.id)
        .then((data)=>{
          console.log("favorite removed");
        })
        .catch((err)=>{
          console.log(err);
        });

    } else {
      this.favoriteService.addFavorite(stock.id)
        .then((data)=>{
          console.log("favorite added");
        })
        .catch((err)=>{
          console.log(err);
        });
    }
  }
}
