'use strict'
const Url = require('url');
const Logger = require('../util/logger');
const MsgType = require('../config/msgType');
const request = require('./request');

let apiList = new Map();

function onPutChainMsg(params, res, areturn) {
    let globalIns = require('../app').globalIns;
    let member = params.member;
    //let data = JSON.stringify(params.data);
    let data = params.data;
    let ipAddr = "127.0.0.1";
    let orderID = Date.now();

    globalIns.rpcIns.onPutChainMsg(member, data, ipAddr, orderID, (err, result) => {
        if (err) {
            Logger.error('onPutChainMsg，Error: ' + err);
            res.write(JSON.stringify({isSuccess: false}));
            res.end('500');
            return areturn(err);
        }
        res.write(JSON.stringify({isSuccess: true, orderID: orderID, hash: result}));
        res.end();

        Logger.info("OrderID : " + orderID + ", hash : " + result);

        //globalIns.orderID++;

        let postContent = {
            member: member,
            data: data,
            orderID: orderID,
        }

        request.doPostHim(JSON.stringify(postContent),function (err,result) {
               if(err){
                   Logger.error('PostHim Error');
                   return areturn(err);
               }
               Logger.info("PostHim finished");
               return areturn();
        })

    });
}

function onReplyMsg(params, res, areturn) {
    let globalIns = require('../app').globalIns;
    let member = params.member;
    let isPaticipate = params.isPaticipate?params.isPaticipate:Number(0);
    //let data = JSON.stringify(params.data);
    let data = params.data;
    let orderID = params.orderID;

    globalIns.rpcIns.onReplyMsg(member, isPaticipate, data, orderID, (err, result) => {

        if (err) {
            Logger.error('onReplyMsg，Error: ' + err);
            res.write(JSON.stringify({isSuccess: false}));
            res.end(500);
            return areturn(err);
        }
        Logger.warn("reply Msg put Chain SUCCESS");
        res.write(JSON.stringify({isSuccess: true, hash: result}));
        res.end();
        return areturn();
    })
}

function onGetReplyMsg(params, res, areturn) {
    let globalIns = require('../app').globalIns;
    globalIns.rpcIns.getGivenOrderReplyInfo(params.orderID, (err, result) => {
        if (err || !result) {
            Logger.error('onGetReplyMsg，Error: ' + err);
            res.write(JSON.stringify({isSuccess: false}));
            res.end(500);
            return areturn(err);
        }

        let returnMsg = {
            member: result.member,
            isParticipate: result.isParticipate,
            data: result.data
        }

        res.write(JSON.stringify(returnMsg));
        res.end();
        return areturn();

    })
}

function onGetPutMsg(params, res, areturn) {
    let globalIns = require('../app').globalIns;
    globalIns.rpcIns.getGivenOrderInfo(params.orderID,(err,result)=>{
        if(err){
            res.end(500);
            return areturn(err);
        }
        res.write(JSON.stringify(result));
        res.end();
        return areturn();
    })
}

function requestHandler(req, res) {
    let pathName = Url.parse(req.url).pathname.substr(1);
    let params;
    if (req.method == 'GET') {
        Logger.warn("GET method from ：" + req.ip);
        //
    }
    else {
        if (req.body) {
            params = req.body;
            // if(req.headers['content-type'] === 'application/json'){
            //     params=JSON.parse(req.body);
            // }
        }
    }
    Logger.info("recv msg: %s, params:%s", pathName, params);

    if (params && typeof params === 'string') {
        try {
            params = JSON.parse(params);
        } catch (err) {
            res.end(1001);
            return;
        }
    }

    if (!params) {
        res.end(1002);
        return;
    }

    let handler = apiList.get(pathName);
    if (handler) {
        handler(params, res, function (err, result) {
            if (err) {
                Logger.error('[CLIENT] ', err.message);
            }
            res.end();
        })
    } else {
        res.status(404);
        res.end();
    }
}

function registApi(msgPath, handler) {
    if (!msgPath || !handler || typeof handler !== 'function') {
        return false;
    }

    if (apiList.has(msgPath)) {
        Logger.error('duplicate register for:' + msgPath);
        return false;
    }

    apiList.set(msgPath, handler);
    Logger.info('register an api:' + msgPath);
    return true;
}

function initApi() {
    registApi('client' + '/' + MsgType.apiVersion + '/putchainmsg', onPutChainMsg);
    registApi('client' + '/' + MsgType.apiVersion + '/replymsg', onReplyMsg);
    registApi('client' + '/' + MsgType.apiVersion + '/getreplymsg', onGetReplyMsg);
    registApi('client' + '/' + MsgType.apiVersion + '/getPutMsg', onGetPutMsg);
}

exports = {
    initApi: initApi,
    requestHandler: requestHandler,
}

Object.assign(module.exports, exports);