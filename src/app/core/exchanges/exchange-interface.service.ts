import { Market } from "~/app/shared/data-classes/market";

export interface IExchangeService {
    subscribe(ws: WebSocket);
    parse(text: string) : Market;
}
