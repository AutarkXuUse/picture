'use strict'

let request=require('request');
const ServerConfig=require('../config/serverConig')

function doPostHim(content,areturn) {
    request.post({
        headers: {'content-type': 'text/plain; charset=utf-8'},
        url: ServerConfig.hisHost,
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