const CreatorTokenExchange = artifacts.require("CreatorTokenExchange");

contract("CreatorTokenExchange", (accounts) => {

    let [owner, creator, user] = accounts;
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await CreatorTokenExchange.new("CreatorTokenExchange", {from: owner});
    });

    it("should be able to create a new Creator Token", async () => {
        const result = await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator})
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.creatorAddress, creator);
        assert.equal(result.logs[0].args.name, "Protest The Hero");
        assert.equal(result.logs[0].args.symbol, "PTH5");
        assert.equal(result.logs[0].args.description, "This token will help us fund our next album.");
        assert.equal(result.logs[0].args.verified, false);
        assert.equal(result.logs[0].args.outstanding, 0);
        assert.equal(result.logs[0].args.maxSupply, 0);
    })

    xit("should be able to buy Creator Token", async () => {
        const result = await contractInstance.buyCreatorToken(0, 1000000, {from: user, value: 20000000000000000000});
        assert.equal(result.receipt.status, true);
        //assert.equal(result.logs[0].args.account, user);
        //assert.equal(result.logs[0].args.amount, 1000000);
        //assert.equal(result.logs[0].args.transactionType, "buy");
        //assert.equal(result.logs[0].args.tokenId, 0);
        //assert.equal(result.logs[0].args.name, "Protest The Hero");
        //assert.equal(result.logs[0].args.symbol, "PTH5");
    })
/*
    it("should not allow two zombies", async () => {
        await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })

    context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
            const newOwner = await contractInstance.ownerOf(zombieId);
            //TODO: replace with expect
            assert.equal(newOwner, bob);
        })
    })

    context("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: bob});
            const newOwner = await contractInstance.ownerOf(zombieId);
            //TODO: replace with expect
            assert.equal(newOwner,bob);
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.approve(bob, zombieId, {from: alice});
            await contractInstance.transferFrom(alice, bob, zombieId, {from: alice});
            const newOwner = await contractInstance.ownerOf(zombieId);
            //TODO: replace with expect
            assert.equal(newOwner,bob);
         })
    })

    it("zombies should be able to attack another zombie", async () => {
        let result;
        result = await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        const firstZombieId = result.logs[0].args.zombieId.toNumber();
        result = await contractInstance.createRandomZombie(zombieNames[1], {from: bob});
        const secondZombieId = result.logs[0].args.zombieId.toNumber();
        await time.increase(time.duration.days(1));
        await contractInstance.attack(firstZombieId, secondZombieId, {from: alice});
        //TODO: replace with expect
        assert.equal(result.receipt.status, true);
    })
*/
})