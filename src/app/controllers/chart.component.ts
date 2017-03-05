import { Component, Input, OnDestroy } from '@angular/core';
import { StockService} from '../services/stock.service';
import { Stock } from '../models/stock';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'chart-component',
  templateUrl: '../html/chart.component.html',
  providers: [StockService]
})

export class ChartComponent implements OnDestroy {

@Input() stockSymbol;

private stockStream;

constructor(private stockService: StockService){}

ngOnInit(){
//  this.getStockHistory(this.stockSymbol);
//  this.getStockDataStream(this.stockSymbol);
}

ngOnDestroy(){
  //this.stockStream.unsubscribe();
  //this.stockService.endStream(this.stockSymbol);
}

getStockDataStream(symbol) {
  this.lineChartRealTimeData = [{data:[], label:this.stockSymbol}]
  this.stockStream = this.stockService.getStockData(symbol).subscribe((res) => {

    let timestamp = JSON.parse(res).results[0].serverTimestamp;

    this.lineChartRealTimeLabels.push(timestamp.substr(timestamp.indexOf('T') + 1, timestamp.length));
    this.lineChartRealTimeLabels = this.lineChartRealTimeLabels;

    this.lineChartRealTimeData[0].data.push(JSON.parse(res).results[0].lastPrice);
    this.lineChartRealTimeData = this.lineChartRealTimeData.slice()

    console.log(this.lineChartRealTimeLabels);
    console.log(this.lineChartRealTimeData);
    },
  err=>console.log(err)
  );
}

getStockHistory(symbol: string) {
  console.log("getstock history");
  this.stockService.getStockHistory(symbol)
    .subscribe((res) => {
      let data = [];
      let labels = [];
      res.json().results.forEach((row)=>{
        labels.push(row.tradingDay);
        data.push(row.close);
      });
        this.lineChartHistoryData = [ {data: data, label: this.stockSymbol} ]
        this.lineChartHistoryLabels = labels;
    });
}

// Chart config
public lineChartColors:Array<any> = [
  {
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];

public lineChartLegend:boolean = true;
public lineChartType:string = 'line';
public lineChartHistoryData:Array<any> = [{data:[],label:this.stockSymbol}];
public lineChartHistoryLabels:Array<any> = [];
public lineChartOptions:any = {
  responsive: true
};

public lineChartRealTimeData:Array<any> = [{data:[],label:this.stockSymbol}];
public lineChartRealTimeLabels:Array<any> = [];

}
