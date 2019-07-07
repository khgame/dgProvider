export enum ReceiptState {
    Prepared = 0,
    Committed = 1,
    Aborted = 11,
    Finished = 21,
    Canceled = 22,
}

export interface IReceipt {
    /**
     * id of the receipt
     */
    id: string

    /**
     * receipts status: 0 - prepared, 1 - committed, 2 - aborted
     */
    status: ReceiptState

    /**
     * identity of user who created and paid the receipt
     */
    creator: string

    /**
     * symbol of token paid
     */
    sym: string

    /**
     * quantity of token paid
     */
    quantity: string

    /**
     * identity of user who finally received the receipt
     */
    receiver: string

    /**
     * tex rate
     */
    tariff: number

    /**
     * income of official
     */
    income: number

    /**
     * create time of the receipt
     */
    create_at: Date,

    /**
     * latest update time of the receipt
     */
    update_at: Date
}
