import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Stock } from '../models/stock';
import { AuthGuard } from './auth-guard.service';
import { Observable } from 'rxjs/Observable';
import * as io from "socket.io-client";


@Injectable()
export class StockService {

  private socket;
  constructor(private http: Http, private auth: AuthGuard){
    this.socket = io.connect("http://localhost:3000");
  }

  searchStocks(name:string): Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks/external/search/' + name, options)
      .toPromise();
  }

  getStockData(symbol: string): Observable<any> {
    return new Observable(observer=> {
      this.socket.emit('startStream',{channel: symbol});
      this.socket.on('newSocketData', (data)=>{
        observer.next(data);
      });
    });
  }

  getStockHistory(symbol: string): Observable<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks/history/' + symbol, options);
  }

  addStockToDatabase(stock: Stock): Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token, 'Content-Type':'application/json'});
    const options = new RequestOptions({ headers: headers });
      return this.http.post('/api/stocks/submit', stock, options)
        .toPromise();
  }

  getStocks(): Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks', options)
      .toPromise();
  }

  getStock(stockId: number): Promise<Response> {
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization': authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks/' + stockId, options)
      .toPromise();
  }

  endStream(symbol){
    this.socket.emit('endStream',{channel:symbol});
  }
}
