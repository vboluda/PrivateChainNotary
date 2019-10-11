const contract = require('truffle-contract');
const Web3 = require('web3');
const util = require('ethereumjs-util'); 
console.log("PATH: "+process.cwd());
const Notary_artifact = require('../build/contracts/Notary.json');

module.exports =  function(opts){
    opts = opts || {}
    this.web3url = opts.web3url || "http://localhost:7545/";
    this.ownerAccount=opts.ownerAccount || null;
    this.notaryAccount=opts.notaryAccount || null;
    this.contract=contract(Notary_artifact);
    this.web3 = new Web3();
    this.web3.setProvider(new this.web3.providers.HttpProvider(this.web3url));
    this.contract.setProvider(this.web3.currentProvider);
    this.instance=null;
    var _this=this;
    //Parche para qur funcione
    if (typeof this.contract.currentProvider.sendAsync !== "function") {
        this.contract.currentProvider.sendAsync = function() {
            return _this.contract.currentProvider.send.apply(_this.contract.currentProvider, arguments);
        };
    }
    
    this.deploy=async function(){
        _this.instance = await _this.contract.deployed();
    }

    this.at= async function(contractAddress){
        _this.instance = await _this.contract.at(contractAddress);
    }

    //function getOwner() public view returns(address)
    this.getOwner = async function(){
        // if(!_this.ownerAccount){
        //     throw Error ('This functionality cannot be invoked unless ownerAccount is defined');
        // }
        return _this.instance.getOwner();
    }

    
    // function addNotary(address _newNotary) public onlyOwner()
    this.addNotary= async function(notaryAddress){
        if(!_this.ownerAccount){
            throw Error ('This functionality cannot be invoked unless ownerAccount is defined');
        }
        return _this.instance.addNotary(notaryAddress,{"from": _this.ownerAccount});
    }


    //function removeNotary(address _rmNotary) public onlyOwner()
    this.removeNotary= async function(notaryAddress){
        if(!_this.ownerAccount){
            throw Error ('This functionality cannot be invoked unless ownerAccount is defined');
        }
        return _this.instance.removeNotary(notaryAddress,{"from": _this.ownerAccount});
    }

    //function checkNotary(address _chkNotary) public view returns(bool)
    this.checkNotary= async function(notaryAddress){
        return _this.instance.checkNotary(notaryAddress);
    }

    //function storeValidation(uint _blockdepth, uint64 _hash)
    this.storeValidation= async function(_blockdepth,_hash){
        if(!_this.notaryAccount){
            throw Error ('This functionality cannot be invoked unless notaryAccount is defined');
        }
        console.log("Add storeValidation call: (%s,%s)",_blockdepth,_hash);
        return _this.instance.storeValidation(_blockdepth,_hash,{"from": _this.notaryAccount});
    }

    
    /*
    function getValidation(address _notary) public view 
    returns(
        uint blockDepth,
        uint64 blockHash,
        uint publicChainBlockDepth
    )
    */
    this.getValidation= async function(notaryAddress){
        console.log("Check getValidation call: "+notaryAddress);
        var r = await this.instance.getValidation(notaryAddress);
        return {blockDepth:r[0],blockHash:r[1],publicChainBlockDepth:r[2]};
    }


    this.suscribeEvents=function(){
         console.log("Event subscription");
         _this.eventValidation=_this.instance.eventValidation();
         _this.eventValidation.watch(function(e,r){
             if(e){
                console.error("Error subscribe event validation");
             }else{
                console.log("Event validation detected "+r);
             }
         });
         _this.eventNotary=_this.instance.eventNotary();
         _this.eventValidation.watch(function(e,r){
            if(e){
               console.error("Error subscribe event notary");
            }else{
               console.log("Event notary detected "+r);
            }
        });
      }
};
