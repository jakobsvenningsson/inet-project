import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Stock } from '../models/stock';
import { AuthGuard } from './auth-guard.service';


@Injectable()
export class StockService {

  constructor(private http: Http, private auth: AuthGuard){}

  searchStocks(name:string): Promise<Response>{
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks/external/search/' + name, options)
      .toPromise();
  }

  addStockToDatabase(stock: Stock): Promise<Response>{
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token, 'Content-Type':'application/json'});
    const options = new RequestOptions({ headers: headers });
      return this.http.post('/api/stocks/submit', stock, options)
        .toPromise();
  }

  getStocks(): Promise<Response>{
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks', options)
      .toPromise();
  }

  getStock(id: string): Promise<Response>{
    const authToken = this.auth.getUser();
    const headers = new Headers({'Authorization' : authToken.token});
    const options = new RequestOptions({ headers: headers });
    return this.http.get('/api/stocks/' + id, options)
      .toPromise();
  }
}
