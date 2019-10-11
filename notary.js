const Config = require("./truffle-config");
const PrivateChain=require("./lib/privateChain");
const notaryContract = require("./lib/NotaryContract");

if(process.argv.length!=3){
    console.log("Bad argument number");
    return;
}


var environment=process.argv[2];
console.log("Environment selected: "+environment);
var config=Config.networks[environment].privateNode;
console.log("Config selected: ",config);
var url="http://"+config.host+":"+config.port;
var notaryAddress=config.notaryAddress
console.log("Private Node URL: "+url);
var notary=new notaryContract({
    notaryAccount: notaryAddress
});

var privateChain=new PrivateChain({web3url:url});

(async function() {
    var blockInfo=await privateChain.getBlockInfo();
    //console.log("INFO %j",blockInfo);
    console.log("Blocknumber: "+blockInfo.number);
    console.log("BlockHash: "+blockInfo.hash);
    await notary.deploy();
    console.log("Notary deployed %j",notary.instance);
    var owner=await notary.getOwner();
    console.log("Contract owner address "+owner);
    await notary.storeValidation(blockInfo.number,blockInfo.hash);
    var r=await notary.getValidation(notary.notaryAccount);
    console.log("Result: "+r.blockDepth+" "+r.blockHash+" "+r.publicChainBlockDepth);
    console.log("HEX 0x"+r.blockHash.toString(16));
    console.log("HASH ")
})();


