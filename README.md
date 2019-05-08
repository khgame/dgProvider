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

#### Remote Service

Interface files in the directory [./src/remoteService](remoteService) can be used as references.  
By the way, if the remote service is implemented using js/ts, you can also import these interfaces directly into the project.  

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
        `{ "result": {id, status, creator, sym, quantity, receiver, tariff, create_at, update_at} }`
        - listReceipts(start, limit, option?, sort?)
        > get a list of receipts  
        option : `{status?, creator?, sym?, receiver?}`  
        sort : `{quantity?, create_at?, update_at?}`
        
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
        > pay tokens and create an receipt
    

- Game server side
    - hset
        - hset(scope, key, val)
        > set value by scope and key
        - hinc(scope, key, val)
        > inc number value by scope and key
        - hdel(scope, key)
        > del value by scope and key
    - receipt
        - commitReceipt(receiptId, receiver, texRate)
        > commit the receipt and send tokens to receiver and official accounts (by logic server)
        - abortReceipt(receiptId, memo)
        > abort the receipt and return tokens (by logic server)
    



