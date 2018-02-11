'use strict'
let Web3 = require('web3');

var web3Ins = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));

console.log(web3Ins.eth.getBalance('0x25dd1247f24b64f03765f0eac26d3354bfabc113'));

web3Ins.eth.personal.unlockAccount("0x3189d40061552e970fedfd135d1d6a23873eef13", "123456", 86400, (err, res) => {
    console.log(err);
    console.log(res);
});
