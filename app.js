'use strict'
process.title='BlockPoc';

const Logger = require('./util/logger');
const Express = require('express');
const BodyParser = require('body-parser');
const Async = require('async');
const RpcInit=require('./rpc/init');
const exitTime = 5100;//ms

let globalIns={
    rpcIns:{},
    orderID:1,
};

function initServer(areturn) {
    Async.series([
        function (done) {
            const ApiManager = require('./apimanager/apis');
            ApiManager.initApi();
            done();
        },
        function (done) {
            RpcInit.initRpcConn((err,ins)=>{
                if(err){
                    return done(err);
                }
                globalIns.rpcIns=ins;
                return done();
            });
        },
    ], function (err, results) {
        if (err) {
            Logger.error('initServer, error:' + err.message);
            return areturn(new Error('init server error.'));
        }
        exports.globalIns=globalIns;
        return areturn(null, results);
    });
}

function runServer() {
    let app = Express();
    let rawBodySaver = function (req, res, buf, encoding) {
        if (buf && buf.length) {
            req.rawBody = buf.toString('utf8');
        }
    };

    app.use(BodyParser.json({verify: rawBodySaver}));
    app.use(BodyParser.urlencoded({verify: rawBodySaver, extended: true}));
    app.use(BodyParser.raw({verify: rawBodySaver, type: '*/*'}));

    const ApiManager = require('./apimanager/apis');
    app.use('/', ApiManager.requestHandler);

    const httpServer = app.listen({host: '0.0.0.0', port: 12345}, function () {
        Logger.info('wallet server start at:', httpServer.address());
    });

}

function ensureSafeExit() {

}

//退出前处理;
function handleBeforeExit(err, value) {
    Logger.info("退出前处理", err, value);
    return true;
}


//退出处理;
function handleExit(err, value) {
    console.log("退出处理", err, value);
    return true;
}

//SIGINT处理(Ctrl+C)
function handleSigInt(err, value) {
    Logger.warn("SIGINT处理，准备退出", err, value);
    process.exit()
    return;
}

function handleUncaughtException(err) {
    Logger.error("uncaught exception:", err.stack);
}

initServer(function (err) {
    if (err) {
        Logger.error('INIT FAIL');
        process.exit();
        return;
    }
    Logger.info('Server init success.Start running ...');
    process.on("beforeExit", handleBeforeExit);
    process.on("exit", handleExit);
    process.on("SIGINT", handleSigInt);
    process.on("uncaughtException", handleUncaughtException);

    runServer();
});

Object.assign(module.exports, exports);