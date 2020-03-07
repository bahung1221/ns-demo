import { Component, OnInit } from "@angular/core";
import { MarketInfoService } from "~/app/core/services/market-info.service";
import { WebsocketService } from "~/app/core/services/websocket.service";
import { Market } from "~/app/shared/data-classes/market";

const EXCHANGES = ['BYBIT', 'DERIBIT'];

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html",
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
    private headers = {
        exchange: 'Exchange',
        buy: 'Ask',
        sell: 'Bid',
        last: 'Last',
        high: 'High',
        low: 'Low',
    };
    public marketInfo: any[] = [
        this.headers,
    ];

    constructor(
        public marketInfoService: MarketInfoService,
        private websocketService: WebsocketService,
    ) {}

    ngOnInit(): void {
        this._initEmptyData();

        this.marketInfoService.observable.subscribe((newMarketInfo: { exchange: string, market: Market }) => {
            const index = this.marketInfo.findIndex(cur => cur.exchange === newMarketInfo.exchange);

            if (index >= 0) {
                this.marketInfo[index] = {
                    exchange: newMarketInfo.exchange,
                    ...newMarketInfo.market
                }
            }
        })
    }

    private _initEmptyData() {
        EXCHANGES.forEach(exchange => {
            this.marketInfo.push({
                exchange,
                buy: 0,
                sell: 0,
                last: 0,
                high: 0,
                low: 0,
            })
        })
    }
}
