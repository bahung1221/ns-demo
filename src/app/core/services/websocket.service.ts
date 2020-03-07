import { Injectable, NgZone } from "@angular/core";
import { BybitService } from "~/app/core/exchanges/bybit/bybit.service";
import { MarketInfoService } from "~/app/core/services/market-info.service";
import { IExchangeService } from "~/app/core/exchanges/exchange-interface.service";

require("nativescript-websockets");

const EXCHANGES = ['BYBIT'];

const EXCHANGE_SOCKET_URLS = {
    BYBIT: 'wss://stream-testnet.bybit.com/realtime',
};

@Injectable({
    providedIn: 'root'
})
export class WebsocketService {
    private sockets : WebSocket[] = [];

    constructor(
        private zone: NgZone,
        private bybitService: BybitService,
        private marketInfoService: MarketInfoService,
    ) {
        EXCHANGES.forEach(exchange => {
            const socket = new WebSocket(EXCHANGE_SOCKET_URLS[exchange], []);

            this.initWS(exchange, socket, this.bybitService);
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
