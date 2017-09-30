import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/dataService';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/authService';
import { ISubscription } from "rxjs/Subscription";
import { Observable } from "rxjs/Rx";
import { Chart } from 'angular-highcharts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  user: any;
  watchlist: any[];
  selectedStock: any;
  quantity: number;

  authSub: ISubscription;
  dataSub: ISubscription;
  watchlistSub: ISubscription;
  priceSub: ISubscription;
  modalPriceSub: ISubscription;

  textInput: string;
  textOutput: string;
  showHistorical: boolean;

  retrievedQuote: any;

  plots: number[];

  chart = new Chart({
    chart: {
      zoomType: 'x'
    },
    title: {
      text: 'Historical Data'
    },
    xAxis: {
      type: 'datetime'
    },
    yAxis: {
        title: {
            text: 'Exchange Rate'
        }
    },
    legend: {
      enabled: false
    },
    series: []
  });

  constructor(public dataService: DataService, public router: Router, public authService: AuthService) { }

  ngOnDestroy()
  {
    if(this.authSub) this.authSub.unsubscribe();
    if(this.dataSub) this.dataSub.unsubscribe();
    if(this.watchlistSub) this.watchlistSub.unsubscribe();
    if(this.priceSub) this.priceSub.unsubscribe();
  }

  ngOnInit() {
    this.user = {
      displayName: "",
      email: "",
      balance: 0,
      net: 0
    };

    this.selectedStock = {
      name: "",
      price: ""
    };

    this.showHistorical = false;

    this.authSub = this.authService.checkAuth()
    .subscribe(user => {
      if(!user){
        this.router.navigate(['login']);
      }
      else{
        const path = `users/${user.uid}`;

        this.dataSub = this.authService.retrieveData(path)
        .subscribe(user => {
          this.user = user;
          const path = `users/${this.authService.retrieveUID()}/watchlist`;

          this.watchlistSub = this.authService.retrieveList(path)
          .subscribe(snapshots => {
            this.watchlist = [];

            snapshots.forEach(snapshot => {
              this.watchlist.push({
                id: snapshot.key,
                name: snapshot.val().name,
                symbol: snapshot.val().symbol,
                owned: snapshot.val().owned
              });
            });

            this.retrievePrices(this.watchlist);

            this.priceSub = Observable.interval(3000).subscribe(x => {
              this.retrievePrices(this.watchlist);
            });
          });
        });
      }
    });
  }

  retrievePrices(list) {
    let data = {symbols: []};

    list.forEach(stock => {
      data.symbols.push(stock.symbol);
    });

    this.dataService.retrieveQuotes(data)
    .subscribe(response => {
      let quotes = JSON.parse(response.text());

      for(var i = 0; i < quotes.length; ++i)
      {
        for(var j = 0; j < list.length; ++j)
        {
          if(quotes[i].Symbol == list[j].symbol)
          {
            list[j].price = quotes[i].LatestTradePrice;
          }
        }
      }

      this.user.net = 0;

      for(var q = 0; q < list.length; ++q)
      {
        this.user.net += (list[q].owned * list[q].price);
      }

      this.user.net = (parseFloat(this.user.net) + parseFloat(this.user.balance)).toFixed(2);
    });
  }

  querySymbol() {
    let data = {
      'symbols': [this.textInput]
    };

    this.dataService.retrieveQuotes(data)
    .subscribe(response => {
      let quotes = JSON.parse(response.text());
      this.retrievedQuote = quotes[0];
    });
  }

  addToList(quote) {
    const path = `users/${this.authService.retrieveUID()}/watchlist`;
    const data = {
      name: quote.Name,
      symbol: quote.Symbol,
      owned: 0
    };

    this.authService.pushData(path, data)
    .then(data => {
      //console.log('success', data);
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  removeFromList(stock)
  {
    const path = `users/${this.authService.retrieveUID()}/watchlist`;

    this.authService.removeFromList(path, stock)
    .then(data => {
      //console.log('success', data);
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  openModal(stock)
  {
    this.selectedStock = stock;
    this.quantity = null;

    let data = {
      'symbols': [stock.symbol]
    };

    this.dataService.retrieveQuotes(data)
    .subscribe(response => {
      let quotes = JSON.parse(response.text());
      this.selectedStock.price = quotes[0].LatestTradePrice;
    });

    this.modalPriceSub = Observable.interval(3000).subscribe(x => {
      this.dataService.retrieveQuotes(data)
      .subscribe(response => {
        let quotes = JSON.parse(response.text());
        this.selectedStock.price = quotes[0].LatestTradePrice;
      });
    });
  }

  closeBuyModal() {
    this.modalPriceSub.unsubscribe();
  }

  buyStock() {
    // update balance
    const userPath = `users/${this.authService.retrieveUID()}`;
    const userData = {
      balance: (this.user.balance - (this.selectedStock.price * this.quantity)).toFixed(2)
    };

    this.authService.update(userPath, userData)
    .then(data => {
      //console.log('success', data);
    })
    .catch(error => {
      console.log('error', error);
    });

    // update shares
    const listPath = `users/${this.authService.retrieveUID()}/watchlist/${this.selectedStock.id}`;
    const listData = {
      owned: this.selectedStock.owned + this.quantity
    };
    
    this.authService.update(listPath, listData)
    .then(data => {
      //console.log('success', data);
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  sellStock() {
    // update balance
    const userPath = `users/${this.authService.retrieveUID()}`;
    const userData = {
      balance: (parseFloat(this.user.balance) + (parseFloat(this.selectedStock.price) * this.quantity)).toFixed(2)
    };

    this.authService.update(userPath, userData)
    .then(data => {
      //console.log('success', data);
    })
    .catch(error => {
      console.log('error', error);
    });

    // update shares
    const listPath = `users/${this.authService.retrieveUID()}/watchlist/${this.selectedStock.id}`;
    const listData = {
      owned: this.selectedStock.owned - this.quantity
    };
    
    this.authService.update(listPath, listData)
    .then(data => {
      //console.log('success', data);
    })
    .catch(error => {
      console.log('error', error);
    });
  }

  retrieveHistorical(stock) {
    this.showHistorical = true;

    this.dataService.retrieveHistorical(stock.symbol)
    .subscribe(response => {
        var data = JSON.parse(response.text());

        var content = JSON.parse(data.content);

        var series = content["Time Series (Daily)"];

        var list = [];

        for(var key in series){
          var date = new Date(key);

          list.push([date.getTime(), parseFloat(series[key]["4. close"])]);
        }

        list = list.reverse();

        if(this.chart.options.series.length != 0) {
          this.chart.removeSerie(0);
        }

        this.chart.options.title.text = stock.name;

        this.chart.addSerie({
          type: 'area',
          name: stock.symbol.toUpperCase(),
          data: list
        });
    });
  }
}
