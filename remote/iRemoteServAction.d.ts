
export declare interface IRemoteServiceAction {

    /**
     * [GET] the count of all performed actions
     * * @return {Promise<number>} nonce
     */
    nonce() : Promise<number>;

    /**
     * [GET] actions by given start position and limit
     * @param start
     * @param limit
     * @return {Promise<any[]>} actions of the nonce from the start to start + limit
     */
    actions(start: number, limit: number) : Promise<any[]>;
}
