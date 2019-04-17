export enum ReceiptState {
    Prepared = 0,
    Committed = 1,
    Aborted = 11
}

export interface IReceiptDealer {

    fnGetReceiptType: (receiptId: string) => Promise<"buy" | "trade">;
    fnDealBuyReceipt: (receiptId: string, receiptData: any) => Promise<boolean>;
    fnDealTradeReceipt: (receiptId: string, receiptData: any) => Promise<{ user: string, texRate: number } | undefined>;

    receiptPrepared(receiptId: string, receiptData: any): Promise<void>;

    checkReceiptState(receiptId: string): Promise<ReceiptState>;

    commitReceipt(receiptId: string, seller: string, texRate: number): Promise<boolean>;

    abortReceipt(receiptId: string): Promise<boolean>;

    parseMsgToReceipt(msg: any): Promise<{ receiptId: string, receiptData: any } | undefined>;

}

export abstract class ReceiptDealer<TMsgType> implements IReceiptDealer {

    constructor(
        public readonly fnGetReceiptType: (receiptId: string) => Promise<"buy" | "trade">,
        public readonly fnDealBuyReceipt: (receiptId: string, receiptData: any) => Promise<boolean>,
        public readonly fnDealTradeReceipt: (receiptId: string, receiptData: any) => Promise<{ user: string, texRate: number } | undefined>,
    ) {

    }

    async receiptPrepared(receiptId: string, receiptData: any) { // client : server listen
        switch (await this.fnGetReceiptType(receiptId)) {
            case "buy":
                const buyResult = await this.fnDealBuyReceipt(receiptId, receiptData);
                if (buyResult) {
                    await this.commitReceipt(receiptId, "", 10000);
                } else {
                    await this.abortReceipt(receiptId);
                }
                break;
            case "trade":
                const tradeResult = await this.fnDealTradeReceipt(receiptId, receiptData);
                if (tradeResult) {
                    await this.commitReceipt(receiptId, tradeResult.user, tradeResult.texRate);
                } else {
                    await this.abortReceipt(receiptId);
                }
                break;
        }
    }

    abstract async checkReceiptState(receiptId: string): Promise<ReceiptState>;

    abstract async commitReceipt(receiptId: string, seller: string, texRate: number): Promise<boolean>; // == confirm / ctConfirm

    abstract async abortReceipt(receiptId: string): Promise<boolean>; // +

    abstract async parseMsgToReceipt(msg: TMsgType): Promise<{ receiptId: string, receiptData: any } | undefined>;
}
