import {IReceipt} from "./iReceipt";
import {IUserContext} from "./iUserContext";

export interface IRemoteServiceReceipt {

    /**
     * [GET] get receipt by receiptId
     * @param {string} receiptId
     * @return {Promise<IReceipt>}
     */
    checkReceipt(receiptId: string): Promise<IReceipt>

    /**
     * [GET] get a list of receipts
     * @param {number} start
     * @param {number} limit
     * @param {*} options - [OPTIONAL] searching operations {status?, creator?, sym?, receiver?}
     * @param {*} sort - [OPTIONAL] sorting operations {quantity?, create_at?, update_at?}
     * @return {Promise<IReceipt[]>}
     */
    listReceipts(
        start: number,
        limit: number,
        options?: {status?: number, creator?: string, sym?: string, receiver?: string},
        sort?: {quantity?: 1|-1, create_at?: 1|-1, update_at?: 1|-1}
        ): Promise<IReceipt[]>

    /**
     * [SET] [User] pay tokens and create an receipt
     * @param {IUserContext} ctx
     * @param {string} receiptId
     * @param {string} sym
     * @param {string} quantity
     * @return {Promise<number>} - error code: 0 - success
     */
    createReceipt(ctx: IUserContext, receiptId: string, sym: string, quantity: string): Promise<IReceipt | undefined>

    /**
     * [SET] [Serv] commit the receipt and send tokens to receiver and official accounts (by logic server)
     * @param {string} receiptId
     * @param {string} receiver
     * @param {number} tariff - the tex rate
     * @return {Promise<number>} - error code: 0 - success
     */
    commitReceipt(receiptId: string, receiver: string, tariff: number): Promise<number>

    /**
     * [SET] [Serv] abort the receipt and return tokens (by logic server)
     * @param {string} receiptId
     * @param {string} memo
     * @return {Promise<number>} - error code: 0 - success
     */
    abortReceipt(receiptId: string, memo: string): Promise<number>
}
