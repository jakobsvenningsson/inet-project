import { Component, OnInit } from '@angular/core';
import { StockService} from '../services/stock.service';
import { FavoriteService } from '../services/favorite.service';
import { Stock } from '../models/stock';
import { AuthGuard } from '../services/auth-guard.service';
import { Favorite } from '../models/favorite';

@Component({
  selector: 'stock-list-component',
  templateUrl: '../html/stock-list.component.html',
  providers: [StockService, FavoriteService]
})

export class StockListComponent implements OnInit{

  stockList:Stock[] = [];
  constructor(private stockService:StockService, private auth: AuthGuard,  private favoriteService: FavoriteService){}

  ngOnInit(){
    // Get all stocks and current users favorites.
    Promise.all([this.stockService.getStocks(), this.favoriteService.getFavorites()])
      .then((values)=>{
        values[0].json().forEach((stock) => {
          if(values[1].json().length && values[1].json().find((favorite) => Number(favorite.stockId) === Number(stock.id))) {
            this.stockList.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id, true));
          } else {
            this.stockList.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id));
          }
        });
      })
      .catch((err)=>{
        console.log(err);
      });
      // Subscribe for updates of favorites
      this.favoriteService.favoriteStream()
        .subscribe((favorite: Favorite)=>{
            this.updateFavoriteList(favorite);
        });
  }

  updateFavoriteList(data){
    for(let i = 0; i < this.stockList.length; ++i){
      if(Number(data.stockId) === Number(this.stockList[i].id)){
        this.stockList[i].favorite = data.isFavorite;
        console.log(this.stockList[i].favorite );
      }
    }
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
