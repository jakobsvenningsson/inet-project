import { Component } from '@angular/core';
import { StockService} from '../services/stock.service';
import { Stock } from '../models/stock';
import { ActivatedRoute } from '@angular/router';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartComponent } from './chart.component';
import { Observable } from 'rxjs/Observable';

interface stockRouterParam{
  id: number;
}

@Component({
  selector: 'stock-component',
  templateUrl: '../html/stock.component.html',
  providers: [StockService]
})
export class StockComponent{

  stockSymbol:string;
  stock:Stock;

  constructor(private stockService: StockService, private route: ActivatedRoute){}

  ngOnInit() {
    this.route.params
      .subscribe((param: stockRouterParam) => {
         this.stockService.getStock(param.id)
          .then((res) => {
            const stock = res.json();
            this.stock = new Stock(stock.name, stock.symbol, stock.exchange, stock.id);
            this.stockSymbol = stock.symbol;
          })
          .catch((err) => {
            console.log(err);
          });
      });
    }
}
