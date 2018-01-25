# Blockchain certification application

A front-end connecting to a smart contract on the Ethereum blockchain, which
allows saving a timestamped SHA-256 hash for a document.

Hashes are calculated in-browser and sent
using [Web3](https://github.com/ethereum/web3.js/).

By default a Web3 injected into the browser is used (e.g. [MetaMask](https://metamask.io/)
or [Mist](https://github.com/ethereum/mist)).

The contract is deployed on mainnet, rinkeby and kovan. 

If no Web3 object is found the code connects via a back-end to the [INFURA API](https://infura.io/).
In this case the Rinkeby network is used.

the back-end uses a file **keys.json** with private keys and api keys, which is not included
the public repository for obvious reasons. The syntax is:

```javascript
{
  "account" : "<ethereum account>",
  "privKey" : "<account private key without leading 0x>",
  "infuraApiKey": "<infura API key>"
}  
```
A working version is deployed at (https://block-cert.herokuapp.com/).

This project is licensed under the terms of the MIT license.
