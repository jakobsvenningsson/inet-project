import { Component, OnInit } from '@angular/core';
import { StockService} from './services/stock.service';
import { FavoriteService } from './services/favorite.service';
import { Stock } from './models/stock';

@Component({
  selector: 'favorites-stocks-component',
  templateUrl: './html/favorites-stocks.component.html',
  providers: [StockService, FavoriteService],
  styles: ['../styles.css']
})

export class FavoriteStocksComponent implements OnInit{
  stocks:Array<any>;
  constructor(private stockService: StockService, private favoriteService: FavoriteService){}
  ngOnInit(){
    this.favoriteService.getTopList()
      .then((data)=>{
        console.log(data);
        this.stocks = data.json();
      }).catch((err)=>{
        console.log(err);
      });

      this.favoriteService.favoriteStream()
        .subscribe((data)=>{
          this.updateTopList(data);
        });
  }

  updateTopList(data){
    console.log(data);
    let d = data.favorite ? 1 : -1;
    this.stocks.find((stock)=> stock.id == data.stock).favoriteCount+=d;
    this.stocks.sort((a, b)=>{
      return b.favoriteCount - a.favoriteCount;
    });
  }
}
