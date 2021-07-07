const CreatorTokenExchange = artifacts.require("CreatorTokenExchange");
const utils = require("./helpers/utils");

contract("CreatorTokenExchange", (accounts) => {

    let [owner, creator, newCreator, user] = accounts;
    let contractInstance;
    beforeEach(async () => {
        contractInstance = await CreatorTokenExchange.new("CreatorTokenExchange");
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

    context("in the normal course of transacting", async () => {
	    it("should be able to buy Creator Token", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        const result = await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        assert.equal(result.receipt.status, true);
	        assert.equal(result.logs[1].args.account, user);
	        assert.equal(result.logs[1].args.amount, 5000);
	        assert.equal(result.logs[1].args.transactionType, "buy");
	        assert.equal(result.logs[1].args.tokenId, 0);
	        assert.equal(result.logs[1].args.name, "Protest The Hero");
	        assert.equal(result.logs[1].args.symbol, "PTH5");
	    })
	    it("should be able to sell Creator Token", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        const result = await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        assert.equal(result.receipt.status, true);
	        assert.equal(result.logs[1].args.account, user);
	        assert.equal(result.logs[1].args.amount, 5000);
	        assert.equal(result.logs[1].args.transactionType, "sell");
	        assert.equal(result.logs[1].args.tokenId, 0);
	        assert.equal(result.logs[1].args.name, "Protest The Hero");
	        assert.equal(result.logs[1].args.symbol, "PTH5");
	    })
	    it("should not be able to sell more than outstanding amount of Creator Token", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await utils.shouldThrow(contractInstance.sellCreatorToken(0, 2000000, user, {from: user}));
	    })
	    it("should not be able to sell another user's Creator Tokens", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await utils.shouldThrow(contractInstance.sellCreatorToken(0, 5000, owner, {from: user}));
	    })
	   	xit("should not pay creator in a transaction in which a new level of maxSupply is not hit", async () => {

	    })
	    xit("should be able to handle transactions with odd numbers of tokens", async () => {

	    })
	    xit("should be able to handle transactions with very large numbers of tokens", async () => {

	    })
	    xit("should correctly update quantity of tokens outstanding after each transaction", async () => {

	    })
	})

	context("post-transaction holdership mappings", async () => {
		it("should correctly update userToHoldings after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 5000);
	    })
	    it("should correctly update tokenHoldership after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let holdings = await contractInstance.tokenHoldership(0, user);
	        holdings = Number(holdings);
	        assert.equal(holdings, 5000);
	    })
	    it("should correctly update userToHoldings after a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 0);
	    })
	    it("should correctly update tokenHoldership after a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        //totalProceeds = Number(totalProceeds);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let holdings = await contractInstance.tokenHoldership(0, user)
	        holdings = Number(holdings);
	        assert.equal(holdings, 0);
	    })
	})

	xcontext("as a token-holder", async () => {
		it("should allow user to burn their own tokens", async () => {

		})
		it("should not allow user to burn another user's tokens", async () => {
			
		})
		it("should not allow a user to mint tokens", async () => {
			
		})
		it("should allow user to transfer their tokens to another user", async () => {

		})
		it("should correctly update tokenHoldership mapping upon a token transfer", async () => {

		})
		it("should correctly update userToHoldings mapping upon a token transfer", async () => {

		})
		it("should correctly update tokenHoldership mappings upon a batch token transfer", async () => {

		})
		it("should correctly update userToHoldings mappings upon a batch token transfer", async () => {

		})
		it("should be able to set approval", async () => {

		})
		it("should correctly show approval status", async () => {

		})
	})

	xcontext("post-transaction fee accounting", async () => {
		it("should transfer the correct amount to the creator", async () => {

	    })
	    it("should transfer the correct amount to the platform", async () => {

	    })
	    it("should correctly update totalPlatformFees after a transaction", async () => {
	    	
	    })
	    it("should correctly update platformFeesOwed after a transaction", async () => {
	    	
	    })
	    it("should have a CTE wallet balance >0 after a buy/sell of the same number of tokens", async () => {

	    })
	    it("should have a CTE wallet balance == platformFeeUpdater's expectation", async () => {

	    })
	})

    context("as owner", async () => {
        it("should allow withdrawal", async () => {
            const result = await contractInstance.withdraw(owner, {from: owner});
        	assert.equal(result.receipt.status, true);
        })
        it("should allow payout of platform fees", async () => {
        	const result = await contractInstance.payoutPlatformFees(owner, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change to platform fee", async () => {
        	const result = await contractInstance.changePlatformFee(2, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change to profit margin", async () => {
        	const result = await contractInstance.changeProfitMargin(22, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change to token verification status", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeVerification(0, true, {from: owner});
        	assert.equal(result.receipt.status, true);
         })
    })

    context("as non-owner", async () => {
        it("should not allow withdrawal", async () => {
            await utils.shouldThrow(contractInstance.withdraw(user, {from: user}));
        })
        it("should not allow payout of platform fees", async () => {
        	await utils.shouldThrow(contractInstance.payoutPlatformFees(user, {from: user}));
         })
        it("should not allow change to platform fee", async () => {
        	await utils.shouldThrow(contractInstance.changePlatformFee(2, {from: user}));
         })
        it("should not allow change to profit margin", async () => {
        	await utils.shouldThrow(contractInstance.changeProfitMargin(22, {from: user}));
         })
        it("should not allow change to token verification status", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeVerification(0, true, {from: user}));
         })
    })

    context("as creator", async () => {
        it("should allow change of address", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeAddress(0, newCreator, {from: creator});
        	assert.equal(result.receipt.status, true);
        })
        it("should allow change of name", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeName(0, "Protest The Hero New Name", {from: creator});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change of symbol", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeSymbol(0, "PTH5NEW", {from: creator});
        	assert.equal(result.receipt.status, true);
         })
        it("should allow change of description", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	const result = await contractInstance.changeDescription(0, "This token will help us fund our next tour.", {from: creator});
        	assert.equal(result.receipt.status, true);
         })
    })

    context("as non-creator", async () => {
        it("should not allow change of address", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeAddress(0, newCreator, {from: newCreator}));
        })
        it("should not allow change of name", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeName(0, "Protest The Hero New Name", {from: newCreator}));
         })
        it("should not allow change of symbol", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeSymbol(0, "PTH5NEW", {from: newCreator}));
         })
        it("should not allow change of description", async () => {
        	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
        	await utils.shouldThrow(contractInstance.changeDescription(0, "This token will help us fund our next tour.", {from: newCreator}));
         })
    })

/*

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