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
	   	it("should not pay creator in a transaction in which a new level of maxSupply is not hit", async () => {
	   		await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        // Check creator address balance before additional transaction
	        let creatorBalancePre = await web3.eth.getBalance(creator);
	        creatorBalancePre = Number(creatorBalancePre);
	        // User now buys 2500 tokens (leaving maxSupply unchanged) <= these two lines causing test to fail
	        let totalProceedsNew = await contractInstance._totalProceeds(0, 2500);
	        await contractInstance.buyCreatorToken(0, 2500, {from: user, value: totalProceedsNew});
	        // Check creator address balance after additional transaction
	        let creatorBalancePost = await web3.eth.getBalance(creator);
	        creatorBalancePost = Number(creatorBalancePost);
	        // Make sure creator address balanced is unchanged after the second buy transaction
	        assert.equal(creatorBalancePre, creatorBalancePost);
	    })
	    it("should be able to handle transactions with odd numbers of tokens", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5069);
	        const result = await contractInstance.buyCreatorToken(0, 5069, {from: user, value: totalProceeds});
	        assert.equal(result.receipt.status, true);
	    })
	    it("should not be able to buy more tokens than can afford", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 100000);
	        await utils.shouldThrow(contractInstance.buyCreatorToken(0, 100000, {from: user, value: totalProceeds}));
	    })
	    xit("should correctly update quantity of tokens outstanding after each transaction", async () => {

	    })
	})

	context("post-transaction holdership mappings", async () => {
		it("should correctly update userToHoldings after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 5000);
	    })
	    it("should correctly update tokenHoldership after a buy", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        let holdings = await contractInstance.tokenHoldership(0, user);
	        holdings = Number(holdings);
	        assert.equal(holdings, 5000);
	    })
	    it("should correctly update userToHoldings after a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 0);
	    })
	    it("should correctly update tokenHoldership after a sale", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let holdings = await contractInstance.tokenHoldership(0, user)
	        holdings = Number(holdings);
	        assert.equal(holdings, 0);
	    })
	    it("should correctly update userToHoldings after a combination of buys and sales", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        // User now buys 2500 tokens (leaving maxSupply unchanged) <= these two lines causing test to fail
	        let totalProceedsNew = await contractInstance._totalProceeds(0, 2500);
	        await contractInstance.buyCreatorToken(0, 2500, {from: user, value: totalProceedsNew});
	        let holdings = await contractInstance.userToHoldings(user, 0);
	        holdings = Number(holdings);
	        assert.equal(holdings, 2500);
	    })
	    it("should correctly update tokenHoldership after a combination of buys and sales", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        // User now buys 2500 tokens (leaving maxSupply unchanged) <= these two lines causing test to fail
	        let totalProceedsNew = await contractInstance._totalProceeds(0, 2500);
	        await contractInstance.buyCreatorToken(0, 2500, {from: user, value: totalProceedsNew});
	        let holdings = await contractInstance.tokenHoldership(0, user);
	        holdings = Number(holdings);
	        assert.equal(holdings, 2500);
	    })
	})

	context("as a token-holder", async () => {
		it("should allow user to burn their own tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			const result = await contractInstance.burn(user, 0, 5000, {from: user});
			assert.equal(result.receipt.status, true);
		})
		it("should allow user to burnBatch their own tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			const result = await contractInstance.burnBatch(user, [0,1], [5000,5000], {from: user});
			assert.equal(result.receipt.status, true);
		})
		it("should not allow user to burn another user's tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await utils.shouldThrow(contractInstance.burn(user, 0, 5000, {from: creator}));
		})
		it("should not allow user to burnBatch another user's tokens", async () => {
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
			await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH6", "This token will help us fund our next tour.", {from: creator});
			let totalProceeds = await contractInstance._totalProceeds(0, 5000);
			await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
			await contractInstance.buyCreatorToken(1, 5000, {from: user, value: totalProceeds});
			await utils.shouldThrow(contractInstance.burnBatch(user, [0,1], [5000,5000], {from: creator}));
		})
		xit("should not allow a user to mint tokens", async () => {
			
		})
		xit("should not allow a user to mintBatch tokens", async () => {
			
		})
		xit("should allow user to transfer their tokens to another user", async () => {

		})
		xit("should correctly update tokenHoldership mapping upon a token transfer", async () => {

		})
		xit("should correctly update userToHoldings mapping upon a token transfer", async () => {

		})
		xit("should correctly update tokenHoldership mappings upon a batch token transfer", async () => {

		})
		xit("should correctly update userToHoldings mappings upon a batch token transfer", async () => {

		})
		xit("should be able to set approval", async () => {

		})
		xit("should correctly show approval status", async () => {

		})
	})

	context("post-transaction fee accounting", async () => {
		xit("should transfer the correct amount to the creator", async () => {

	    })
	    xit("should transfer the correct amount to the platform", async () => {

	    })
	    xit("should correctly update totalPlatformFees after a transaction", async () => {
	    	
	    })
	    xit("should correctly update platformFeesOwed after a transaction", async () => {
	    	
	    })
	    it("should have a CTE wallet balance >0 after a buy/sell of the same number of tokens", async () => {
	    	await contractInstance.createCreatorToken(creator, "Protest The Hero", "PTH5", "This token will help us fund our next album.", {from: creator});
	        let totalProceeds = await contractInstance._totalProceeds(0, 5000);
	        await contractInstance.buyCreatorToken(0, 5000, {from: user, value: totalProceeds});
	        await contractInstance.sellCreatorToken(0, 5000, user, {from: user});
	        let contractBalance = await web3.eth.getBalance(contractInstance.address);
	        contractBalance = Number(contractBalance);
	        assert.isAbove(contractBalance, 0);
	    })
	    xit("should have a CTE wallet balance == platformFeeUpdater's expectation", async () => {

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