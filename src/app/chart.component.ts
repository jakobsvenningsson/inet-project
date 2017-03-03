import { Component } from '@angular/core';
import { StockService} from './services/stock.service';
import { Stock } from './models/stock';
import { ChartsModule } from 'ng2-charts/ng2-charts';

@Component({
  selector: 'chart-component',
  templateUrl: './html/chart.component.html',
  providers: [StockService],
  styles: ['../styles.css'],
})

export class ChartComponent{
  // lineChart
public lineChartData:Array<any> = [
  {data: [65, 59, 80, 81, 56], label: 'Series A'}
];
public lineChartLabels:Array<any> = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

public lineChartOptions:any = {
  responsive: true,
  maintainAspectRatio: false
};
public lineChartColors:Array<any> = [
  { // grey
    backgroundColor: 'rgba(148,159,177,0.2)',
    borderColor: 'rgba(148,159,177,1)',
    pointBackgroundColor: 'rgba(148,159,177,1)',
    pointBorderColor: '#fff',
    pointHoverBackgroundColor: '#fff',
    pointHoverBorderColor: 'rgba(148,159,177,0.8)'
  }
];
public lineChartLegend:boolean = false;
public lineChartType:string = 'line';

public randomize():void {
let _lineChartData:Array<any> = new Array(this.lineChartData.length);
for (let i = 0; i < this.lineChartData.length; i++) {
  _lineChartData[i] = {data: new Array(this.lineChartData[i].data.length), label: this.lineChartData[i].label};
  for (let j = 0; j < this.lineChartData[i].data.length; j++) {
    _lineChartData[i].data[j] = Math.floor((Math.random() * 100) + 1);
  }
}
this.lineChartData = _lineChartData;
}

// events
public chartClicked(e:any):void {
console.log(e);
}

public chartHovered(e:any):void {
console.log(e);
}

}