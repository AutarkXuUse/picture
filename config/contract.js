'use strict'

module.exports = [
    {
        "constant": true,
        "inputs": [
            {
                "name": "orderID",
                "type": "uint256"
            }
        ],
        "name": "getGivenOrderReplyInfo",
        "outputs": [
            {
                "name": "member",
                "type": "string"
            },
            {
                "name": "isPaticipate",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": true,
        "inputs": [
            {
                "name": "orderID",
                "type": "uint256"
            }
        ],
        "name": "getGivenOrderInfo",
        "outputs": [
            {
                "name": "member",
                "type": "string"
            },
            {
                "name": "data",
                "type": "string"
            },
            {
                "name": "ipAddr",
                "type": "string"
            }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "member",
                "type": "string"
            },
            {
                "name": "data",
                "type": "string"
            },
            {
                "name": "ipAddr",
                "type": "string"
            },
            {
                "name": "orderID",
                "type": "uint256"
            }
        ],
        "name": "onPutChainMsg",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "constant": false,
        "inputs": [
            {
                "name": "member",
                "type": "string"
            },
            {
                "name": "isPaticipate",
                "type": "uint256"
            },
            {
                "name": "data",
                "type": "string"
            },
            {
                "name": "orderID",
                "type": "uint256"
            }
        ],
        "name": "onReplyMsg",
        "outputs": [
            {
                "name": "",
                "type": "bool"
            }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "member",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "data",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "ipAddr",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "orderID",
                "type": "uint256"
            }
        ],
        "name": "putChainMsgEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "name": "member",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "isPaticipate",
                "type": "uint256"
            },
            {
                "indexed": false,
                "name": "data",
                "type": "string"
            },
            {
                "indexed": false,
                "name": "orderID",
                "type": "uint256"
            }
        ],
        "name": "replyMsgEvent",
        "type": "event"
    }
]