'use strict'

let ethInit = require('../rpc/init');

let abi=require("../config/contract");

let contractAddress="0x25dd1247f24b64f03765f0eac26d3354bfabc113";

let conf = {
    host: '127.0.0.1',
    port: 8545,
    account: '123',
    passwd: '123',
    duration: '86400',
    decimal: 18
}

ethInit.initRpcConn((err,ins)=>{
    if(err){
        console.log("init Error:"+err);
        return;
    }

    let conyractIns=ins.getContarctInstance(abi,contractAddress);
    //
    // // ins.getAccounts((err,res)=>{
    // //     console.log(res);
    // // });
    //
    // // console.log("==========这是漂亮的分割线=========");
    // //console.log(conyractIns.options.address);
    // // console.log("read smart contract");
    ins.getGivenOrderInfo(1,function (err,res) {
        console.log('获得数据');
        console.log(res);
    });

    ins.onPutChainMsg("oooooo","qqqqqq","qwyyyyssdd",1,(err,res)=>{
        console.log("写入数据");
        console.log(res);
    })

    // ins.getGivenOrderReplyInfo(1,function (err,res) {
    //     console.log('获得数据=======');
    //     console.log(res);
    // });
    //
    // ins.onReplyMsg("mili",1,"wqeewr",1,(err,res)=>{
    //     console.log("写入数据======");
    //     console.log(res);
    // })




})