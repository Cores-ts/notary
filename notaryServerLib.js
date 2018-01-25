const Web3 = require('web3');
const keys = require('./keys.json');
const tx = require('ethereumjs-tx');
const lightwallet = require('eth-lightwallet');
const txutils = lightwallet.txutils;

let web3 = undefined;
let contract = undefined;

//asign contract address
let address = "0xd121f94184Da71908123a1e08F72cAB8573b9363"

//contract abi
let abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "addDocHash",
    "outputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "hash",
        "type": "bytes32"
      }
    ],
    "name": "findDocHash",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      },
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "constructor"
  }
];;

function init () {
  //set up network
  let provider = new Web3.providers.HttpProvider("https://rinkeby.infura.io/" + keys.infuraApiKey);
  web3 = new Web3(provider);



  //init contract
  contract = new web3.eth.Contract(abi, address);
};

//sends a raw  transaction
function sendRaw(rawTx, callback) {
  let privateKey = new Buffer(keys.privKey, 'hex');
  let transaction = new tx(rawTx);
  transaction.sign(privateKey);
  let serializedTx = transaction.serialize().toString('hex');
  web3.eth.sendSignedTransaction('0x' + serializedTx, function(err, result) {
    callback(err, result)
  });
}


//sends a hash to the blockchain
function sendHash (hash, callback) {

  web3.eth.getTransactionCount(keys.account, function (error, result) {

    let  txOptions = {
      nonce: web3.utils.toHex(result),
      gasLimit: web3.utils.toHex(800000),
      gasPrice: web3.utils.toHex(20000000000),
      to: address
    }
    let rawTx = txutils.functionTx(abi, 'addDocHash', [hash], txOptions);

    sendRaw(rawTx, function (error, result) {
      if (error) console.log(error);

      callback (error, result);
    });

  });

};

//looks up a hash on the blockchain
function findHash (hash, callback) {
  contract.methods.findDocHash(hash).call( function (error, result) {
    if (error) callback(error, null);
    else {
      let resultObj = {
        mineTime:  result[0],
        blockNumber: result[1]
      }
      callback(null, resultObj);
    }
  });
};

let NotaryExports = {
  findHash : findHash,
  sendHash : sendHash,
  init : init,
};

module.exports = NotaryExports;
