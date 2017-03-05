import { Component, OnInit, OnDestroy } from '@angular/core';
import { StockService} from '../services/stock.service';
import { FavoriteService } from '../services/favorite.service';
import { Stock } from '../models/stock';

@Component({
  selector: 'favorites-stocks-component',
  templateUrl: '../html/favorites-stocks.component.html',
  providers: [StockService, FavoriteService]
})

export class FavoriteStocksComponent implements OnInit, OnDestroy {
  stocks:Array<any>;
  constructor(private stockService: StockService, private favoriteService: FavoriteService){}
  private favoriteStream;
  ngOnInit(){
    this.favoriteService.getTopList()
      .then((data)=>{
        console.log(data);
        this.stocks = data.json();
      }).catch((err)=>{
        console.log(err);
      });

      this.favoriteStream = this.favoriteService.favoriteStream()
        .subscribe((data)=>{
          console.log(data);
          this.updateTopList(data);
        });
  }

  ngOnDestroy(){
    this.favoriteStream.unsubscribe();
  }

  updateTopList(favorite){
    console.log("updateToList");
    let d = favorite.isFavorite ? 1 : -1;
    this.stocks.find((stock) => stock.id == favorite.stockId).favoriteCount+=d;
    this.stocks.sort((a, b) => {

      return b.favoriteCount - a.favoriteCount;
    });
  }
}
