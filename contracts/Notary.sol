// solium-disable linebreak-style
pragma solidity >=0.4.21 <0.6.0;

contract Notary {
    address public owner;
    //address[] public notaries change to mapping to allow logical deletion
    mapping(address => bool) notaries;
        
    struct Validation{
        uint blockDepth;
        uint blockHash;
        uint publicChainBlockDepth;
    }
    
    
    mapping(address => Validation) Validations;

    constructor () public {
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(
            msg.sender==owner,
            "You must be owner"
        );
        _;
    }

    modifier onlyNotary(){
        require(
            notaries[msg.sender],
            "You must be an allowed notary"
        );
        _;
    }

    event eventNotary(address notary, bool created);

    event eventValidation(address validator,uint blockDepth,uint blockHash,uint publicChainBlockDepth);

    function getOwner() public view returns(address){
        return owner;
    }

    function addNotary(address _newNotary) public onlyOwner() {
        notaries[_newNotary] = true;
        emit eventNotary(_newNotary,true);
    }

    function removeNotary(address _rmNotary) public onlyOwner() {
        notaries[_rmNotary] = false;
        emit eventNotary(_rmNotary,false);
    }

    function checkNotary(address _chkNotary) public view returns(bool){
        return notaries[_chkNotary];
    }

    function storeValidation(uint _blockdepth, uint _hash) public onlyNotary{
        Validation storage validation = Validations[msg.sender];
        validation.blockDepth = _blockdepth;
        validation.blockHash = _hash;
        validation.publicChainBlockDepth = block.number;
        emit eventValidation(msg.sender,validation.blockDepth,validation.blockHash,validation.publicChainBlockDepth);
    }

    function getValidation(address _notary) public view 
    returns(
        uint blockDepth,
        uint blockHash,
        uint publicChainBlockDepth
    ){
        return(
            Validations[_notary].blockDepth,
            Validations[_notary].blockHash,
            Validations[_notary].publicChainBlockDepth
        );

    }
}