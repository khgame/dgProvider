
export interface IRemoteServiceHSet {

    /**
     * [GET] all scopes in the service
     * @return a list of all scopes
     */
    scopes(): Promise<string[]>;

    /**
     * [GET] all keys of a scope in the service
     * @param {string} scope
     * @return {Promise<string[]>} a list of all keys in the scope
     */
    hkeys(scope: string): Promise<string[]>;

    /**
     * [GET] check is the key are provided in the scope
     * @param {string} scope
     * @param {string} key
     * @return {Promise<boolean>} whether the key is exist
     */
    hexist(scope:string, key:string): Promise<boolean>;

    /**
     * [GET] a value by given scope and key
     * @param scope
     * @param key
     * @return {Promise<string>}
     */
    hget(scope: string, key: string): Promise<string>;

    /**
     * [GET] all key-value pairs by given scope
     * @param {string} scope
     * @return {Promise<*>} - { KEY: VAL, ... }
     */
    hgetall(scope: string) : Promise<any>;

    /**
     * [SET] [Serv] set value by scope and key
     * @param {string} scope
     * @param {string} key
     * @param {string} val
     * @return {Promise<number>} error code
     */
    hset(scope: string, key: string, val: string): Promise<number>;

    /**
     * [SET] [Serv] inc number value by scope and key
     * @param {string} scope
     * @param {string} key
     * @param {string} val
     * @return {Promise<number>} error code
     */
    hinc(scope: string, key: string, val: string): Promise<number>;

    /**
     * [SET] [Serv] del value by scope and key
     * @param {string} scope
     * @param {string} key
     * @param {string} val
     * @return {Promise<number>} error code
     */
    hdel(scope: string, key: string): Promise<number>;

}
