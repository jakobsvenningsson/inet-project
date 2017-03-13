import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService} from '../services/stock.service';
import { FavoriteService } from '../services/favorite.service';
import { Stock } from '../models/stock';
import { AuthGuard } from '../services/auth-guard.service';
import { Favorite } from '../models/favorite';


// TODO BUG WHEN BOTH UPDATES OF TOP LIST AND FAVORITE PAGE GOES THROUGH SAME SOCKET CHANNEL!

@Component({
  selector: 'stock-list-component',
  templateUrl: '../html/stock-list.component.html',
  providers: [StockService, FavoriteService]
})

export class StockListComponent implements OnInit, OnDestroy{

  stocks = {active:true, list:[]};
  private favoriteStream;
  constructor(private stockService:StockService, private auth: AuthGuard,  private favoriteService: FavoriteService){}

  ngOnInit(){
    // Get all stocks and current users favorites.
    Promise.all([this.stockService.getStocks(), this.favoriteService.getFavorites()])
      .then((values)=>{
        values[0].json().forEach((stock) => {
          console.log(stock);
          if(values[1].json().length && values[1].json().find((favorite) => favorite.stockId === stock.id)) {
            this.stocks.list.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id, true));
          } else {
            this.stocks.list.push(new Stock(stock.name, stock.symbol, stock.exchange, stock.id, false));
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
      // Subscribe for updates of favorites
      /*this.favoriteStream = this.favoriteService.favoriteStream()
        .subscribe((favorite: Favorite )=> {
          console.log("update");
            this.updateFavoriteList(favorite);
        });*/
  }

  ngOnDestroy() {
  //  this.favoriteStream.unsubscribe();
  }

  updateFavoriteList(favorite: Favorite) {
    this.stocks.list.map((stock) => {
      if(favorite.stockId === stock.id) {
        stock.favorite = favorite.isFavorite;
        return stock;
      }
    });
  }

  alterFavorite(stock: Stock) {

    if(this.stocks.active){
      this.stocks.active = false;
      if(stock.favorite) {
        this.updateFavoriteList(new Favorite(this.auth.getUser().id, stock.id, false));
        this.favoriteService.removeFavorite(stock.id)
          .then((res) => {
            this.stocks.active = true;
            console.log("favorite removed");
          })
          .catch((err) => {
            console.log(err);
          });

      } else {
        this.updateFavoriteList(new Favorite(this.auth.getUser().id, stock.id, true));
        this.favoriteService.addFavorite(stock.id)
          .then((data) => {
            this.stocks.active = true;
            console.log("favorite added");
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }

  }
}
