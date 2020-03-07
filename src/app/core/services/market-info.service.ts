import { Injectable } from "@angular/core";
import { Market } from "~/app/shared/data-classes/market";
import { Subject } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class MarketInfoService {
    marketInfo = {};
    observable = new Subject();

    constructor() {}

    public updateMarketInfo(exchange: string, market: Market) {
        if (!this.marketInfo[exchange]) {
            this.marketInfo[exchange] = market;
            return
        }

        for (let key in market) {
            this._updateMarketField(exchange, key, market[key]);
        }

        this.observable.next({
            exchange,
            market: this.marketInfo[exchange],
        });
    }

    private _updateMarketField(exchange: string, field: string, value) {
        this.marketInfo[exchange][field] = value;
    }

}
