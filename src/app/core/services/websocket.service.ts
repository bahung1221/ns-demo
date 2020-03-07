import { Injectable, NgZone } from "@angular/core";
import { BybitService } from "~/app/core/exchanges/bybit/bybit.service";
import { MarketInfoService } from "~/app/core/services/market-info.service";
import { IExchangeService } from "~/app/core/exchanges/exchange-interface.service";
import { DeribitService } from "~/app/core/exchanges/deribit/deribit.service";

require("nativescript-websockets");

const BYBIT = 'BYBIT';
const DERIBIT = 'DERIBIT';
const EXCHANGES = [BYBIT, DERIBIT];

const EXCHANGE_SOCKET_URLS = {
    BYBIT: 'wss://stream-testnet.bybit.com/realtime',
    DERIBIT: 'wss://test.deribit.com/ws/api/v2',
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
        private marketInfoService: MarketInfoService,
    ) {
        EXCHANGES.forEach(exchange => {
            const socket = new WebSocket(EXCHANGE_SOCKET_URLS[exchange], []);

            // TODO: move init socket function to each exchange service
            const service = exchange === BYBIT ? this.bybitService : this.deribitService;

            this.initWS(exchange, socket, service);
            this.sockets.push(socket);
        })
    }

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
