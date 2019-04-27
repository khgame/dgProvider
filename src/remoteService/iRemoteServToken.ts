
export interface IRemoteServToken {

    /**
     * [GET] check balance of the userIdentity
     * @param {string} userIdentity
     * @param {string} tokenSym
     * @return {Promise<number | string>}
     */
    balance(userIdentity: string, tokenSym: string): Promise<number|string>;

    /**
     * [SET] transfer token from one user to another
     * @param {string} userIdentity
     * @param {string} to
     * @param {string} tokenSym
     * @param {string} quantity
     * @param {string} memo
     * @return {Promise<number>}
     */
    transfer(userIdentity: string, to: string, tokenSym: string, quantity: string, memo: string): Promise<number>;

    /**
     * [SET] [Optional] withdraw token from layer 2 to layer 1
     * @param {string} userIdentity
     * @param {string} tokenSym
     * @param {string} quantity
     * @return {Promise<number>}
     */
    withdraw(userIdentity: string, tokenSym: string, quantity: string): Promise<number>;

    /**
     * [SET] [Optional] charge token from layer 1 to layer 2
     * @param {string} userIdentity
     * @param {string} tokenSym
     * @param {string} quantity
     * @return {Promise<number>}
     */
    charge(userIdentity: string, tokenSym: string, quantity: string): Promise<number>;

}
