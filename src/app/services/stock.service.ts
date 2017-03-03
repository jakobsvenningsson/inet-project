import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Stock } from '../models/stock';

@Injectable()
export class StockService {

  constructor(private http: Http){}

  searchStocks(name:string): Promise<Response>{
    return this.http.get('/api/stocks/external/search/' + name)
      .toPromise();
  }

  addStockToDatabase(stock: Stock): Promise<Response>{
    let headers = new Headers({'Content-type' : 'application/json'});
    let options = new RequestOptions({ headers: headers });
      return this.http.post('/api/stocks/submit', stock, options)
        .toPromise();
  }

  getStocks(): Promise<Response>{
    return this.http.get('/api/stocks')
      .toPromise();
  }

  getStock(id: string): Promise<Response>{
    return this.http.get('/api/stocks/' + id)
      .toPromise();
  }
}
