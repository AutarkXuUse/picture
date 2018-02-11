const Logger = require('../util/logger');
const Web3 = require('web3');
let rpcCode = require('../constance/rpccode');
let util = require('util');
let abi = require('../config/contract');

function ETH(config) {
    this.config = config;
    this.host = config.host;
    this.port = config.port;
    this.account = config.account;
    this.passwd = config.passwd;
    this.contractAddress = config.contractAddress;
    this.duration = config.duration;
    this.decimal = config.decimal;
    this.abi = abi;
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'));
    this.contarctIns = new this.web3.eth.Contract(this.abi, this.contractAddress);
    //this.contarctIns = new this.web3.eth.contract(this.abi).at(this.contractAddress);
}

ETH.prototype.start = function (func) {
    return func();
};

ETH.prototype.getContarctInstance = function (jsonInterface, address) {
    return new this.web3.eth.Contract(jsonInterface, address);
}

ETH.prototype.getAccounts = function (func) {
    this.web3.eth.getAccounts().then(result => {
        return func(null, result);
    });
}

ETH.prototype.stop = function () {

};

ETH.prototype.getBalance = function (address, func) {
    let web3 = this.web3;
    //TODO: note bigNum in nodejs
    try {
        web3.eth.getBalance(address, (err, balance) => {
            if (err) {
                Logger.error(err.message);
                return func(rpcCode.ERR_REQUEST_INVALID, err)
            }
            let data = {
                balance: balance,
            };
            return func(null, data);
        });
    } catch (e) {
        Logger.error(e.message);
        return func(rpcCode.ERR_INTERNAL, new Error("caught a exception in eth/etc balance call"));
    }
};

ETH.prototype.getTransaction = function (hash, func) {
    this.web3.eth.getTransaction(hash, (err, tx) => {
        if (err) {
            Logger.error(err.message);
            return func(rpcCode.ERR_REQUEST_INVALID, err)
        }
        let data = {
            height: tx.blockNumber,
            tx_hash: tx.hash
        };
        return func(rpcCode.NORMAL, data);
    })
};

ETH.prototype.getBestBlockHeight = function (func) {
    this.web3.eth.getBlockNumber((err, height) => {
        if (err) {
            Logger.error(err.message);
            return func(rpcCode.ERR_REQUEST_INVALID, err);
        }
        let data = {
            height: height
        };
        return func(rpcCode.NORMAL, data);
    })
};

ETH.prototype.transfer = function (from, to, amount, memo, func) {
    let web3 = this.web3;
    // this for parity
    // this.duration = '0x' + this.duration.toString(16).padStart(32, '0').slice(-32);
    web3.personal.unlockAccount(from, 123456, this.duration, (err, result) => {
        if (err) {
            Logger.error(err.message);
            return func(rpcCode.ERR_REQUEST_INVALID, err);
        }
        if (!result) {
            Logger.error('unlock account failed');
            return func(rpcCode.ERR_PASSWORD, new Error('password incorrected'));
        }

        let tx = {
            from: from,
            to: to,
            value: amount
        };

        web3.eth.estimateGas(tx, (err, gas) => {
            if (err) {
                Logger.error(err.message);
                return func(rpcCode.ERR_REQUEST_INVALID, err);
            }

            tx['gas'] = gas;
            web3.eth.sendTransaction(tx, (err, tx_hash) => {
                if (err) {
                    Logger.error(err.message);
                    return func(rpcCode.ERR_REQUEST_INVALID, err);
                }
                let data = {
                    tx_hash: tx_hash,
                    fee: gas * (web3.eth.gasPrice.plus(21).toString(10))
                };
                return func(rpcCode.NORMAL, data);
            })
        })
    });
};

ETH.prototype.validateAddress = function (address, func) {
    if (!this.web3.isAddress(address)) {
        return func(rpcCode.ERR_ADDRESS_INVALID, new Error('invalid address'));
    } else {
        return func(rpcCode.NORMAL);
    }

};

ETH.prototype.getGivenOrderInfo = function (orderID, func) {
    this.contarctIns.methods.getGivenOrderInfo(orderID).call({from: this.account}, function (err, result) {
        if (err) {
            return func(err);
        }
        return func(null, result);
    })
}

ETH.prototype.getGivenOrderReplyInfo = function (orderID, func) {
    this.contarctIns.methods.getGivenOrderReplyInfo(orderID).call({from: this.account}, function (err, result) {
        if (err) {
            return func(err);
        }
        return func(null, result);
    })
}

ETH.prototype.onPutChainMsg = function (memder, data, ipAddr,orderID, func) {
    let web3 = this.web3;
    web3.eth.personal.unlockAccount(this.account, this.passwd, this.duration, (err, result) => {
        if (err) {
            return func(err);
        }
        if (!result) {
            return func('Unlock fail');
        }

        this.contarctIns.methods.onPutChainMsg(memder, data, ipAddr,orderID).send({from: this.account,gasPrice:60000000000,gas:1194875}, (err, res) => {
            if (err) {
                return func(err);
            }
            return func(null, res);
        })
    })
}

ETH.prototype.onReplyMsg = function (member, isPaticipate, data,orderID, func) {
    let web3 = this.web3;
    web3.eth.personal.unlockAccount(this.account, this.passwd, this.duration, (err, result) => {
        if (err) {
            return func(err);
        }
        if (!result) {
            return func('Unlock fail');
        }

        this.contarctIns.methods.onReplyMsg(member, isPaticipate, data,orderID).send({from: this.account,gasPrice:60000000000,gas:1194875}, (err, res) => {
            if (err) {
                return func(err);
            }
            return func(null, res);
        })
    })
}

module.exports = ETH;
