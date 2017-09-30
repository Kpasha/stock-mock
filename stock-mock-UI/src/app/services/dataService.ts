import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

@Injectable()

export class DataService {
    url: string;

    constructor(public http:Http) { 
        this.url = "http://stockmockapi-dev.us-west-1.elasticbeanstalk.com/";
        //this.url = "http://localhost:59313/";
    }

    retrieveQuotes(symbols) {
        return this.http.post(this.url + 'api/quotes', symbols);
    }

    retrieveHistorical(symbol) {
        return this.http.post(this.url + 'api/historical', {symbol: symbol});
    }
}