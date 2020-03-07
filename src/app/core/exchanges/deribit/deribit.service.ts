import { Injectable } from "@angular/core";
import { IExchangeService } from "~/app/core/exchanges/exchange-interface.service";
import { Market } from "~/app/shared/data-classes/market";

const INSTRUMENT_TOPIC = 'ticker.BTC-PERPETUAL.100ms';

@Injectable({
    providedIn: 'root'
})
export class DeribitService implements IExchangeService {
    constructor() {}

    public subscribe(ws: WebSocket) {
        ws.send(JSON.stringify({
            id: 1,
            jsonrpc: '2.0',
            method: 'public/subscribe',
            params: {
                channels: [
                    INSTRUMENT_TOPIC,
                ]
            },
        }))
    }

    public parse(text: string) : Market {
        const msg = JSON.parse(text);
        const params = msg.params;

        if (params && params.channel === INSTRUMENT_TOPIC) {
            return this._handleInstrumentMessage(params.data);
        }

        return new Market();
    }

    private _handleInstrumentMessage(data) : Market {
        const market = new Market();

        market.last = this._formatPrice(data.last_price);
        market.buy = this._formatPrice(data.best_ask_price);
        market.sell = this._formatPrice(data.best_bid_price);
        market.high = this._formatPrice(data.max_price);
        market.low = this._formatPrice(data.min_price);
        market.indexPrice = this._formatPrice(data.index_price);
        market.tagPrice = this._formatPrice(data.mark_price);
        market.time = data.timestamp;

        return market
    }

    private _formatPrice(price: number) : number {
        return parseFloat(price.toFixed(1));
    }

}
