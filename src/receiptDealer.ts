import {ReceiptState} from "./model/iReceipt";

export interface IReceiptDealer {

    fnGetReceiptType: (receiptId: string) => Promise<"buy" | "trade">;
    fnDealBuyReceipt: (receiptId: string, receiptData: any) => Promise<boolean>;
    fnDealTradeReceipt: (receiptId: string, receiptData: any, fnReceiveTransfer: (user: string, texRate: number) => void) => Promise<boolean>;

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
            (receiptId: string, receiptData: any) => Promise<boolean>,
        public readonly fnDealTradeReceipt:
            (receiptId: string, receiptData: any, fnReceiveTransfer: (user: string, texRate: number) => void) => Promise<boolean>,
    ) {

    }

    async receiptPrepared(receiptId: string, receiptData: any) { // client : server listen
        switch (await this.fnGetReceiptType(receiptId)) {
            case "buy":
                const buyResult = await this.fnDealBuyReceipt(receiptId, receiptData);
                if (buyResult) {
                    await this.commitReceipt(receiptId, "", 0);
                } else {
                    await this.abortReceipt(receiptId);
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
                if (tradeResult) {
                    await this.commitReceipt(receiptId, transferBlob.user, transferBlob.texRate);
                } else {
                    await this.abortReceipt(receiptId);
                }
                break;
        }
    }

    abstract async checkReceiptState(receiptId: string): Promise<ReceiptState>;

    abstract async commitReceipt(receiptId: string, receiver: string, texRate: number): Promise<boolean>; // == confirm / ctConfirm

    abstract async abortReceipt(receiptId: string): Promise<boolean>;
}
