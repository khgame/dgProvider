export enum ReceiptState {
    Prepared = 0,
    Committed = 1,
    Aborted = 11
}

export interface IReceiptDealer {

    getReceiptType: (receiptId: string) => Promise<"buy" | "trade">;
    dealBuyReceipt: (receiptId: string, receiptData: any) => Promise<boolean>;
    dealTradeReceipt: (receiptId: string, receiptData: any) => Promise<{ user: string, texRate: number } | undefined>;

    receiptPrepared(receiptId: string, receiptData: any): Promise<void>;

    checkReceiptState(receiptId: string): Promise<ReceiptState>;

    commitReceipt(receiptId: string, seller: string, texRate: number): Promise<boolean>;

    abortReceipt(receiptId: string): Promise<boolean>;

}

export abstract class ReceiptDealer implements IReceiptDealer {

    constructor(
        public readonly getReceiptType: (receiptId: string) => Promise<"buy" | "trade">,
        public readonly dealBuyReceipt: (receiptId: string, receiptData: any) => Promise<boolean>,
        public readonly dealTradeReceipt: (receiptId: string, receiptData: any) => Promise<{ user: string, texRate: number } | undefined>,
    ) {

    }

    async receiptPrepared(receiptId: string, receiptData: any) { // client : server listen
        switch (await this.getReceiptType(receiptId)) {
            case "buy":
                const buyResult = await this.dealBuyReceipt(receiptId, receiptData);
                if (buyResult) {
                    await this.commitReceipt(receiptId, "", 10000);
                } else {
                    await this.abortReceipt(receiptId);
                }
                break;
            case "trade":
                const tradeResult = await this.dealTradeReceipt(receiptId, receiptData);
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
}
