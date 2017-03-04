import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './controllers/app.component';
import { LoginComponent } from './controllers/login.component';
import { RegisterComponent } from './controllers/register.component';
import { HomeComponent } from './controllers/home.component';
import { AuthGuard } from './services/auth-guard.service';
import { StockSearchComponent } from './controllers/stock-search.component';
import { StockListComponent } from './controllers/stock-list.component';
import { StockComponent } from './controllers/stock.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartComponent } from './controllers/chart.component';
import { UnautherizedComponent } from './controllers/unautherized.component';
import { CommentComponent } from './controllers/comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FavoriteStocksComponent } from './controllers/favorites-stocks.component';


const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'unautherized', component: UnautherizedComponent},
  { path: 'stock-search',component: StockSearchComponent, canActivate:[AuthGuard] },
  { path: 'favorites',component: FavoriteStocksComponent, canActivate:[AuthGuard] },
  { path: 'stocks', component: StockListComponent, canActivate:[AuthGuard]},
  { path: 'stocks/:id', component: StockComponent, canActivate:[AuthGuard]},
  { path: '**',
    redirectTo: 'home'
  }
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    StockSearchComponent,
    StockListComponent,
    StockComponent,
    ChartComponent,
    CommentComponent,
    UnautherizedComponent,
    FavoriteStocksComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule,
    ChartsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(appRoutes,{useHash: true})
  ],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
