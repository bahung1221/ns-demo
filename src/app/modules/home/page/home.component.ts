import { Component, OnInit } from "@angular/core";
import { MarketInfoService } from "~/app/core/services/market-info.service";
import { WebsocketService } from "~/app/core/services/websocket.service";
import { Market } from "~/app/shared/data-classes/market";

const EXCHANGES = ['BYBIT', 'DERIBIT', 'BITMEX', 'OKEX', 'LIQUID', 'BITMAX'];
const PRICE_STATUSES = {
    NORMAL: 'normal',
    UP: 'up',
    DOWN: 'down',
};

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
                const oldMarketInfo = this.marketInfo[index];

                this.marketInfo[index] = {
                    exchange: newMarketInfo.exchange,
                    ...this._convertNewMarketInfo(oldMarketInfo, newMarketInfo.market)
                };
            }
        })
    }

    private _initEmptyData() {
        EXCHANGES.forEach(exchange => {
            this.marketInfo.push({
                exchange,
                buy: {
                    price: 0,
                    status: PRICE_STATUSES.NORMAL,
                },
                sell: {
                    price: 0,
                    status: PRICE_STATUSES.NORMAL,
                },
                last: {
                    price: 0,
                    status: PRICE_STATUSES.NORMAL,
                },
                high: {
                    price: 0,
                    status: PRICE_STATUSES.NORMAL,
                },
                low: {
                    price: 0,
                    status: PRICE_STATUSES.NORMAL,
                },
            })
        })
    }

    private _convertNewMarketInfo(oldMarketInfo: any, newMarketInfo: Market) {
        return {
            buy: {
                price: newMarketInfo.buy,
                status: this._getPriceStatus(oldMarketInfo.buy.price, newMarketInfo.buy, oldMarketInfo.buy.status),
            },
            sell: {
                price: newMarketInfo.sell,
                status: this._getPriceStatus(oldMarketInfo.sell.price, newMarketInfo.sell, oldMarketInfo.sell.status),
            },
            last: {
                price: newMarketInfo.last,
                status: this._getPriceStatus(oldMarketInfo.last.price, newMarketInfo.last, oldMarketInfo.last.status),
            },
            high: {
                price: newMarketInfo.high,
                status: this._getPriceStatus(oldMarketInfo.high.price, newMarketInfo.high, oldMarketInfo.high.status),
            },
            low: {
                price: newMarketInfo.low,
                status: this._getPriceStatus(oldMarketInfo.low.price, newMarketInfo.low, oldMarketInfo.low.status),
            },
        }
    }

    private _getPriceStatus(oldPrice: number, newPrice: number, oldStatus: string) : string {
        if (oldPrice > newPrice) return PRICE_STATUSES.DOWN;
        if (newPrice > oldPrice) return PRICE_STATUSES.UP;

        return oldStatus;
    }
}
