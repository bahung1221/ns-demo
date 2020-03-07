import { Injectable, NgZone } from "@angular/core";
import { BybitService } from "~/app/core/exchanges/bybit/bybit.service";
import { MarketInfoService } from "~/app/core/services/market-info.service";
import { IExchangeService } from "~/app/core/exchanges/exchange-interface.service";
import { DeribitService } from "~/app/core/exchanges/deribit/deribit.service";
import { OkexService } from "~/app/core/exchanges/okex/okex.service";

require("nativescript-websockets");

const BYBIT = 'BYBIT';
const DERIBIT = 'DERIBIT';
const OKEX = 'OKEX';
const EXCHANGES = [BYBIT, DERIBIT, OKEX];

const EXCHANGE_SOCKET_URLS = {
    BYBIT: 'wss://stream-testnet.bybit.com/realtime',
    DERIBIT: 'wss://test.deribit.com/ws/api/v2',
    OKEX: 'wss://real.okex.com:8443/ws/v3',
};

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private sockets : WebSocket[] = [];

    constructor(
        private zone: NgZone,
        private bybitService: BybitService,
        private deribitService: DeribitService,
        private okexService: OkexService,
        private marketInfoService: MarketInfoService,
    ) {
        EXCHANGES.forEach(exchange => {
            const socket = new WebSocket(EXCHANGE_SOCKET_URLS[exchange], []);

            // TODO: move init socket function to each exchange service
            let service: IExchangeService
            if (exchange === BYBIT) {
                service = this.bybitService
            }
            if (exchange === DERIBIT) {
                service = this.deribitService
            }
            if (exchange === OKEX) {
                service = this.okexService
            }

            this.initWS(exchange, socket, service);
            this.sockets.push(socket);
        })
    }

    /**
     * Attach event listeners to websocket instance
     *
     * @param exchange
     * @param ws
     * @param service
     */
    private initWS(exchange: string, ws: WebSocket, service: IExchangeService) {
        ws.addEventListener('open', event => {
            this.zone.run(() => service.subscribe(ws));
        });

        ws.addEventListener('message', event => {
            this.zone.run(() => {
                const market = service.parse(event.data);

                this.marketInfoService.updateMarketInfo(exchange, market)
            });
        });

        ws.addEventListener('close', event => {
            this.zone.run(() => {
                // TODO
            });
        });
        ws.addEventListener('error', event => {
            console.log("The socket had an error", event);
        });
    }
}
