import {Injectable} from "@angular/core";
import {IExchangeService} from "~/app/core/exchanges/exchange-interface.service";
import { Market } from "~/app/shared/data-classes/market";
import {OrderBookItem} from "~/app/core/exchanges/bybit/order-book-item";

const INSTRUMENT_TOPIC = `instrument_info.100ms.BTCUSD`
const ORDER_BOOK25 = `orderBookL2_25.BTCUSD`

@Injectable({
    providedIn: 'root'
})
export class BybitService implements IExchangeService {
    private orderBook : OrderBookItem[] = [];

    constructor() {}

    public subscribe(ws: WebSocket) {
        ws.send(JSON.stringify({
            op: 'subscribe',
            args: [INSTRUMENT_TOPIC, ORDER_BOOK25],
        }))
    }

    public parse(text: string) : Market {
        const msg = JSON.parse(text);

        if (msg.topic === INSTRUMENT_TOPIC) {
            return this._handleInstrumentMessage(msg);
        }

        if (msg.topic === ORDER_BOOK25) {
            return this._handleOrderBookMessage(msg)
        }

        return new Market();
    }

    private _handleInstrumentMessage(msg) : Market {
        let data = msg.data;
        const market = new Market();

        if (data.update && data.update.length) {
           data = data.update[0]
        }

        if (data.last_price_e4) market.last = this._formatPrice(data.last_price_e4);
        if (data.high_price_24h_e4) market.high = this._formatPrice(data.high_price_24h_e4);
        if (data.low_price_24h_e4) market.low = this._formatPrice(data.low_price_24h_e4);
        if (data.index_price_e4) market.indexPrice = this._formatPrice(data.index_price_e4);
        if (data.mark_price_e4) market.tagPrice = this._formatPrice(data.mark_price_e4);
        if (data.updated_at) market.time = data.updated_at;

        return market
    }

    private _handleOrderBookMessage(msg) : Market {
        const data = msg.data;

        // TODO: use type === delta or type === snapshot
        if (Array.isArray(data)) { this._replaceOrderBook(data) }
        if (data.delete && data.delete.length) { this._deleteOrderBook(data.delete) }
        if (data.update && data.update.length) { this._updateOrderBook(data.update) }
        if (data.insert && data.insert.length) { this._insertOrderBook(data.insert) }

        return this._calculatePriceFromOrderBook();
    }

    /**
     * Replace all current order book data by new data
     *
     * @param {Array} data
     * @private
     */
    private _replaceOrderBook(data) {
        this.orderBook.splice(0, ORDER_BOOK25.length);
        data.forEach(order => this.orderBook.push(order))
    }

    /**
     * Delete specifics records in order book
     *
     * @param {Array} data
     * @private
     */
    private _deleteOrderBook(data) {
        data.forEach(cur => {
            const index = this.orderBook.findIndex(order => order.id === cur.id);
            if (index >= 0) { this.orderBook.splice(index, 1) }
        })
    }

    /**
     * Update (replace) specifics records in order book
     *
     * @param {Array} data
     * @private
     */
    private _updateOrderBook(data) {
        data.forEach(cur => {
            const index = this.orderBook.findIndex(order => order.id === cur.id);
            if (index >= 0) { this.orderBook[index] = cur }
        })
    }

    /**
     * Insert new records into order book
     * @param {Array} data
     * @private
     */
    private _insertOrderBook(data) {
        data.forEach(cur => {
            this.orderBook.push(cur);
        })
    }

    /**
     * Calculate current price data from order book and then save it into global market info data
     *
     * @private
     */
    private _calculatePriceFromOrderBook() : Market {
        const buySide = [];
        const sellSide = [];
        const market = new Market();

        this.orderBook.forEach(order => {
            const price = parseFloat(order.price.toString());
            if (order.side === 'Buy') {
                buySide.push(price);
                return
            }

            sellSide.push(price)
        });

        // TODO: hardcode
        const buy = Math.max(...buySide);
        const sell = Math.min(...sellSide);

        market.buy = buy;
        market.sell = sell;
        return market
    }

    private _formatPrice(price: number) : number {
        return parseFloat((price / 10000).toString())
    }

}
