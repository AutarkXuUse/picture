'use strict'
let Erc=require('../rpc/erc');
let config=require('../config/rpc');

let ercIns=new Erc(config);

ercIns.unLockAccount((err,res)=>{
    console.log(err);
    console.log(res);
})