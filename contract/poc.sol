pragma solidity ^0.4.0;

contract poc {

    function poc(){

    }

    struct putChainMsg {
        string member;
        string data;
        string ipAddr;
    }

    struct replyMsg {
        string member;
        uint isPaticipate;
        string data;
        uint orderID;
    }

    mapping(uint => putChainMsg) putChainMsgKeyMap;
    mapping(uint => replyMsg) replyMsgKeyMap;

    event putChainMsgEvent(string member, string data, string ipAddr, uint orderID);
    event replyMsgEvent(string member, uint isPaticipate, string data, uint orderID);

    function onPutChainMsg(string member, string data, string ipAddr,uint orderID) public returns (bool){
        putChainMsgKeyMap[orderID].member = member;
        putChainMsgKeyMap[orderID].data = data;
        putChainMsgKeyMap[orderID].ipAddr = ipAddr;
        putChainMsgEvent(member, data, ipAddr, orderID);
        return true;
    }

    function getGivenOrderInfo(uint orderID) constant public returns (string member, string data, string ipAddr){
        member = putChainMsgKeyMap[orderID].member;
        data = putChainMsgKeyMap[orderID].data;
        ipAddr = putChainMsgKeyMap[orderID].ipAddr;
    }

    function onReplyMsg(string member, uint isPaticipate, string data, uint orderID) public returns (bool){
        replyMsgKeyMap[orderID].member = member;
        replyMsgKeyMap[orderID].isPaticipate = isPaticipate;
        replyMsgKeyMap[orderID].data = data;
        replyMsgEvent(member, isPaticipate, data, orderID);
    }

    function getGivenOrderReplyInfo(uint orderID) constant public returns (string member, uint isPaticipate, string data){
        member = replyMsgKeyMap[orderID].member;
        isPaticipate = replyMsgKeyMap[orderID].isPaticipate;
        data = replyMsgKeyMap[orderID].data;
    }

}
