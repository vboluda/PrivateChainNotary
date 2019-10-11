var notaryContract = require("./lib/NotaryContract");

var notary=new notaryContract({
    ownerAccount:"0x6836f6Db4eaDF7CC216D75482a43F74F3E3dD6a7",
    notaryAccount:"0x705938760daB8E4347f43849456849295BC2B390"
});

async function execute(){
    await notary.deploy();
    var owner=await notary.getOwner();
    console.log("Owner "+owner);
    var tx=await notary.addNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c");
    console.log("addNotary %j",tx);
    var res=await notary.checkNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c");
    console.log("Check: "+res);
    var tx2=await notary.removeNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c");
    console.log("delNotary %j",tx2);
    var res=await notary.checkNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c");
    console.log("Check: "+res);
    var tx=await notary.addNotary(notary.notaryAccount);
    console.log("addNotary %j",tx);
    await notary.storeValidation("150","0x231cad3c86d19dce61875de1f60e98d0d9492ab888af9395fa743584b679def7");
    var r=await notary.getValidation(notary.notaryAccount);
    console.log("Result: "+r.blockDepth+" "+r.blockHash+" "+r.publicChainBlockDepth);
}   
execute();

// notary.deploy(function(){
//     notary.getOwner(function(r){
//         console.log("Owner address "+r);
//         notary.checkNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c",function(r){
//             console.log("Is checked: "+r);
//             notary.addNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c", function(){
//                 notary.checkNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c",function(r){
//                     console.log("Is checked: "+r);
//                     notary.removeNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c",function(){
//                         notary.checkNotary("0x45ba310b018F607472fAa87DAa64CEABc1EFa07c",function(r){
//                             console.log("Is checked: "+r);
//                         })
//                     })
//                 })
//             });
//         })
//     })
// });

