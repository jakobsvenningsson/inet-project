import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login.component';
import { RegisterComponent } from './register.component';
import { HomeComponent } from './home.component';
import { AuthGuard } from './services/auth-guard.service';
import { StockSearchComponent } from './stock-search.component';
import { StockListComponent } from './stock-list.component';
import { StockComponent } from './stock.component';
import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ChartComponent } from './chart.component';
import { UnautherizedComponent } from './unautherized.component';
import { CommentComponent } from './comment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



const appRoutes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent},
  { path: 'unautherized', component: UnautherizedComponent},
  { path: 'stock-search',component: StockSearchComponent, canActivate:[AuthGuard] },
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
    UnautherizedComponent
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
