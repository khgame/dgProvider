export * from './receiptDealer'

import {IReceiptDealer} from "./receiptDealer";

export abstract class Provider<TMsgType> {

    constructor(
        public readonly cbUpdateNonce: (nonce: number) => boolean,
        public readonly receiptDealer: IReceiptDealer
    ) {

    }

    async start(nonceStart: number): Promise<any> {
        await this.hookEvents(
            nonceStart,
            async (nonce: number, msg: TMsgType) => {
                if (!this.cbUpdateNonce(nonce)) {
                    await this.exit();
                }
                try {
                    await this.triggerHook(nonce, msg)
                } catch (ex) {

                }
            }
        );
    } // listen to chain and call triggerHook here;

    async triggerHook(nonce: number, msg: TMsgType) {
        const parsedMsg = await this.receiptDealer.parseMsgToReceipt(msg);
        if (!parsedMsg) {
            return;
        }
        const {receiptId, receiptData} = parsedMsg;
        await this.receiptDealer.receiptPrepared(receiptId, receiptData);
    }

    abstract async exit(): Promise<any>; // handle exit events

    abstract async hset(hKey: string, key: string, value: string): Promise<boolean>;

    abstract async hookEvents(
        nonceStart: number,
        push: (nonce: number, msg: TMsgType) => Promise<void>
    ): Promise<any>;


}
