const Web3 = require('web3');

module.exports =  function(opts){
    opts = opts || {}
    this.web3url = opts.web3url || "http://localhost:8001/";
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(this.web3url));

    var _this=this;
    this.getBlockInfo=async function(){
        return await _this.web3.eth.getBlock("latest");
    }
};