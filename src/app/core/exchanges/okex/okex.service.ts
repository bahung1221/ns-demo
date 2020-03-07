import { Injectable } from "@angular/core";
import * as pako from 'pako';
import { IExchangeService } from "~/app/core/exchanges/exchange-interface.service";
import { Market } from "~/app/shared/data-classes/market";

const INSTRUMENT_TOPIC = 'swap/ticker:BTC-USD-SWAP';

@Injectable({
    providedIn: 'root'
})
export class OkexService implements IExchangeService {
    constructor() {}

    public subscribe(ws: WebSocket) {
        ws.send(JSON.stringify({
            op: 'subscribe',
            args: [INSTRUMENT_TOPIC]
        }))
    }

    public parse(text: string) : Market {
        const msg = JSON.parse(
            pako.inflateRaw(text, { to: 'string' })
        );
        const data = msg.data;

        if (data && data[0].instrument_id === 'BTC-USD-SWAP') {
            return this._handleInstrumentMessage(data[0]);
        }

        return new Market();
    }

    private _handleInstrumentMessage(data: any) : Market {
        const market = new Market();
        console.log(data)

        market.last = this._formatPrice(data.last);
        market.buy = this._formatPrice(data.best_ask);
        market.sell = this._formatPrice(data.best_bid);
        market.high = this._formatPrice(data.high_24h);
        market.low = this._formatPrice(data.low_24h);
        market.time = data.timestamp;

        return market
    }

    private _formatPrice(price: any) : number {
        if (typeof price === 'string') {
            price = parseFloat(price);
        }
        return parseFloat(price.toFixed(1));
    }

}
