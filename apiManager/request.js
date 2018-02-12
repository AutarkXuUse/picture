'use strict'

let request=require('request');
const ServerConfig=require('../config/serverConig')

function doPostHim(content,areturn) {
    request.post({
        headers: {'content-type': 'application/json; charset=utf-8'},
        url: "http://"+ServerConfig.hisHost+':'+ServerConfig.hisPort+'/mili/block/chain/_accept',
        port:ServerConfig.hisPort,
        body: content
    }, function (err, response, body) {
        if(err){
            return areturn(err);
        }
        return areturn(null,body);
    });
}

exports={
    doPostHim:doPostHim
}

Object.assign(module.exports, exports);