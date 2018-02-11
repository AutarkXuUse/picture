'use strict'

let ETH=require('./eth');
let ethConfig=require('../config/rpc')

function initRpcConn(areturn) {
    let instance=new ETH(ethConfig);
    instance.start((err)=>{
        if(err)
        {
            return areturn(err)
        }
        return areturn(null,instance);
    });
}

exports={
    initRpcConn:initRpcConn,
}

Object.assign(module.exports, exports);