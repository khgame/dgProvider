import {ReceiptState} from "./model/iReceipt";

export enum ReceiptErrorCode {
    BAD_OPERATION = -1, // when didn't enter the logic
    FORBIDDEN = -2, // when validate failed
    INTERNAL_ERROR = -3, // when error before write
    OK = 0, // when success
    WRITE_ERROR = 1, // when some write logic was passed, and then failed
    RPC_ERROR = 2, // when remote call happen, and then failed
}

export interface IReceiptDealer {

    fnGetReceiptType: (receiptId: string) => Promise<"buy" | "trade">;
    fnDealBuyReceipt: (receiptId: string, receiptData: any) => Promise<ReceiptErrorCode | number>;
    fnDealTradeReceipt: (receiptId: string, receiptData: any, fnReceiveTransfer: (user: string, texRate: number) => void) => Promise<ReceiptErrorCode>;

    receiptPrepared(receiptId: string, receiptData: any): Promise<void>;

    checkReceiptState(receiptId: string): Promise<ReceiptState>;

    commitReceipt(receiptId: string, receiver: string, texRate: number): Promise<boolean>;

    abortReceipt(receiptId: string): Promise<boolean>;

}

export abstract class ReceiptDealer implements IReceiptDealer {

    constructor(
        public readonly fnGetReceiptType:
            (receiptId: string) => Promise<"buy" | "trade">,
        public readonly fnDealBuyReceipt:
            (receiptId: string, receiptData: any) => Promise<ReceiptErrorCode | number>,
        public readonly fnDealTradeReceipt:
            (receiptId: string, receiptData: any, fnReceiveTransfer: (user: string, texRate: number) => void) => Promise<ReceiptErrorCode>,
    ) {

    }

    async receiptPrepared(receiptId: string, receiptData: any) { // client : server listen
        switch (await this.fnGetReceiptType(receiptId)) {
            case "buy":
                const buyResult = await this.fnDealBuyReceipt(receiptId, receiptData);
                if(buyResult < 0) {
                    await this.abortReceipt(receiptId);
                } else if (buyResult === ReceiptErrorCode.OK) {
                    await this.commitReceipt(receiptId, "", 10000);
                } else {
                    // do nothing
                }
                break;
            case "trade":
                const transferBlob = { user:"", texRate: 0 };
                const fnReceiveTransfer = (user: string, texRate: number) => {
                    if(transferBlob.user && transferBlob.user !== user) {
                        throw new Error(`fnReceiveTransfer error, user are already set to ${transferBlob.user}`)
                    }
                    transferBlob.user = user;
                    transferBlob.texRate = texRate;
                }

                const tradeResult = await this.fnDealTradeReceipt(receiptId, receiptData, fnReceiveTransfer);
                if(tradeResult < 0) {
                    await this.abortReceipt(receiptId);
                } else if (tradeResult === ReceiptErrorCode.OK) {
                    await this.commitReceipt(receiptId, transferBlob.user, transferBlob.texRate);
                } else {
                    // do nothing
                }
                break;
        }
    }

    abstract async checkReceiptState(receiptId: string): Promise<ReceiptState>;

    abstract async commitReceipt(receiptId: string, receiver: string, tariff: number): Promise<boolean>; // == confirm / ctConfirm

    abstract async abortReceipt(receiptId: string): Promise<boolean>;
}
