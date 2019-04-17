export * from './receiptDealer'

import {IReceiptDealer} from "./receiptDealer";

export abstract class Provider<TMsgType> {

    constructor(
        public readonly cbUpdateNonce: (nonce: number) => boolean,
        public readonly receiptDealer: IReceiptDealer
    ) {

    }

    async start(nonceStart: number, onError?: (nonce: number, receiptId: string, receiptData: any, ex: Error) => any): Promise<any> {
        await this.hookEvents(
            nonceStart,
            async (nonce: number, receiptId: string, receiptData: any) => {
                if (!this.cbUpdateNonce(nonce)) {
                    await this.terminate();
                }
                try {
                    await this.receiptDealer.receiptPrepared(receiptId, receiptData);
                } catch (ex) {
                    if(onError) {
                        onError(nonce, receiptId, receiptData, ex);
                    }
                }
            }
        );
    } // listen to chain and call triggerHook here;

    abstract async terminate(): Promise<any>; // handle exit events

    abstract async hset(hKey: string, key: string, value: string): Promise<boolean>;

    abstract async hookEvents(
        nonceStart: number,
        push: (nonce: number, receiptId: string, receiptData: any) => Promise<void>
    ): Promise<any>;


}
