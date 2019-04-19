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

