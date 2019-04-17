export * from './receipt'

import {IReceiptDealer} from "./receipt";

export abstract class Provider<TMsgType> {

    constructor(
        public readonly updateNounce: (nonce: number) => boolean,
        public readonly receiptDealer: IReceiptDealer
    ) {

    }

    async start(nonceStart: number, cbError: (nonce: number) => number): Promise<any> {
        await this.hookEvents(
            nonceStart,
            async (nonce: number, msg: TMsgType) => this.triggerHook(nonce, msg),
            cbError
         );

    } // listen to chain and call triggerHook here;

    async triggerHook(nonce: number, msg: TMsgType) {
        const parsedMsg = this.getReceiptEventFromData(msg);
        if (!this.updateNounce(nonce)) {
            return false;
        }
        if (!parsedMsg) {
            return true;
        }
        const {receiptId, receiptData} = parsedMsg;
        try {
            await this.receiptDealer.receiptPrepared(receiptId, receiptData);
        } catch (e) {

        }
        return true;
    }

    abstract async exit(): Promise<any>; // handle exit events

    abstract getReceiptEventFromData(msg: TMsgType): { receiptId: string, receiptData: any } | undefined;

    abstract async syncRes(resId: string, value: string): Promise<boolean>;

    abstract async hookEvents(
        nonceStart: number,
        cbMsg: (nonce: number, msg: TMsgType) => Promise<boolean>,
        cbError: (nonce: number) => number): Promise<any>;


}
