import {IUserContext} from "./iUserContext";

export interface IRemoteServToken<TErrorCode> {

    /**
     * [GET] check balance of the userIdentity
     * @param {string} userIdentity
     * @param {string} tokenSym
     * @return {Promise<number | string>}
     */
    balance(userIdentity: string, tokenSym: string): Promise<number|string>;

    /**
     * [SET] [Serv] [Optional] charge token from layer 1 to layer 2
     * @param {string} userIdentity
     * @param {string} tokenSym
     * @param {string} quantity
     * @return {Promise<number>}
     */
    charge(userIdentity: string, tokenSym: string, quantity: string): Promise<TErrorCode>;

    /**
     * [SET] [User] transfer token from one user to another
     * @param {IUserContext} ctx
     * @param {string} to
     * @param {string} tokenSym
     * @param {string} quantity
     * @param {string} memo
     * @return {Promise<number>}
     */
    transfer(ctx: IUserContext,  to: string, tokenSym: string, quantity: string, memo: string): Promise<TErrorCode>;

    /**
     * [SET] [User] [Optional] withdraw token from layer 2 to layer 1
     * @param {IUserContext} ctx
     * @param {string} tokenSym
     * @param {string} quantity
     * @return {Promise<number>}
     */
    withdraw(ctx: IUserContext,  tokenSym: string, quantity: string): Promise<TErrorCode>;

}
