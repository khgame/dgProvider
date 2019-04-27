# eosProvider

## models

### Provider
  
The provider is ultimately responsible for all function calls within the business logic.
It generally includes (but is not limited to) two types of **processing procedure**.

In order to make a specific provider that actually supports a business scenario,
A class who is inherit the 'Provider' class and implement **Provide's interfaces** should be provided.

Those implementations is aimed at provide the concrete usages to a **remote service**.

#### Processing procedure

there are two kinds of Processing procedure:

- hset: set an key-value pair of a scope
- receipt: include three method corresponding to three phases of transactions.
    - hookPrepare
    - commit
    - abort

#### Provide's interfaces

FontEnd

- eosplayer.transcal
- eosplayer.sign
- eosplayer.call
- eosplayer.logout
- eosplayer.login
- eosplayer.getBalance
- eosplayer.chain.checkTableItem
- eosplayer.chain.checkTable
- eosplayer.setNetConf
- eosplayer.switchNetwork

BackEnd

- checkTableItem
- validateSign
- giftcode
- call tradeuni
- call confirm
- call ctconfirm

#### Remote Service

##### Get

- get operations
    - token
        - balance(userIdentity, tokenSym)
        > check balance of the userIdentity  
        response should be the value string of user's balance  
        `{ "result": QUANTITY_NUMBER }`
    - hset
        - scopes()
        > get all scopes in the service  
        response should be a list of all scopes  
        `{ "result": [ ... ] }`
        - hkeys(scope)
        > get all keys of a scope in the service  
        response should be a list of all keys in the scope  
        `{ "result": [ ... ] }`
        - hexist(scope, key)
        > check is the key are provided in the scope  
        response should indicates whether the key is exist  
        `{ "result": true/false }`
        - hget(scope, key)
        > get a value by given scope and key  
        response should be the value of given scope and key  
        `{ "result": VAL }`
        - hgetall(scope)
        > get a key-value pairs by given scope  
        response should be a map of all key-value pairs in the scope  
        `{ "result": { KEY: VAL, ... } }`
    - action
        - nonce() 
        > get the count of all performed actions  
        generally, it is exactly equal to the nonce(starts at 1) or nonce(starts at 0) + 1  
        response should be the value of nonce  
        `{ "result": NONCE_VALUE }`
        - actions(start, limit)
        > get actions by given start position and limit  
        response should be the actions of the nonce from the start to start + limit  
        `{ "result": [ { nonce: NONCE_VALUE, action: ACTION_RECORD}] }`  
        the structure of the action is given in the next chapter 
    - receipt
        - checkReceipt(receiptId)
        > get receipt by receiptId
        `{ "result": {receiptId, status, tokenSym, quantity, receiver, texRate} }`
    - [optional] validateSign : (login)

##### SET

- User side
    - token
        - [Optional] withdraw(userIdentity, tokenSym, quantity)
        > user withdraw token from layer 2 to layer 1
        - [Optional] charge(userIdentity, tokenSym, quantity)
        > user charge tokens from layer 1 to layer 2
        - transfer(from, to, tokenSym, quantity, memo)
        > user transfer tokens to another
    - receipt
        - createReceipt(receiptId, tokenSym, quantity)
        > decline some tokens and create an receipt
    

- Game server side
    - hset
        - hset(scope, key, val)
        - hinc(scope, key, val)
        - hdel(scope, key)
    - receipt
        - commitReceipt(receiptId, receiver, texRate)
        - abortReceipt(receiptId)
    



