const truffleAssert = require('truffle-assertions');
const assert = require("chai").assert;
const Notary = artifacts.require("Notary");
console.log("Start test!!!!");

contract("Notary", async (accounts) => {
    let instance= await Notary.deployed;
    console.log("%j",instance);

    it("Is owner",async () => {
        let owner="0x6836f6Db4eaDF7CC216D75482a43F74F3E3dD6a7";
        let r= await instance.getOwner.call();
        assert.equal(r,owner,"Bad owner");
    });
});