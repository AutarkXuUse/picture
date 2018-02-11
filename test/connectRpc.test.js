'use strict'

let ethInit = require('../rpc/init');

let address="0x3189d40061552e970fedfd135d1d6a23873eef13";

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
    ins.getBalance(address,(err,data)=>{
        if(err){
            console.log('Error getBalance:'+err);
            return;
        }
        console.log(data)
        return;
    })

    ins.getBestBlockHeight((err,res)=>{
        console.log(res);
    })
})