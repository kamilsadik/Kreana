// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokencomputation.sol";

contract CreatorTokenExchange is CreatorTokenComputation {

	constructor(string memory uri) CreatorTokenComputation(uri) { }

	// Event that fires when a new transaction occurs
	event NewTransaction(address indexed account, uint amount, string transactionType, uint tokenId, string name, string symbol);

	// Allow user to buy a given CreatorToken from the platform
	function buyCreatorToken(uint _tokenId, uint _amount) external payable {
		// Compute total transaction proceeds required (inclusive of fee)
		uint totalProceeds = _totalProceeds(_tokenId, _amount)[2];
		// Require that user sends totalProceeds in order to transact
		require(msg.value == totalProceeds);
		// Update platform fee total
		_platformFeeUpdater(_totalProceeds(_tokenId, _amount)[1]);
		// Mint _amount tokens at the user's address (note this increases token amount outstanding)
		mint(msg.sender, _tokenId, _amount, "");
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, "buy", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
		// Check if new outstanding amount of token is greater than maxSupply
		if (creatorTokens[_tokenId].outstanding > creatorTokens[_tokenId].maxSupply) {
			// Update maxSupply
			creatorTokens[_tokenId].maxSupply = creatorTokens[_tokenId].outstanding;
			// Call _payout to transfer excess liquidity
			_payCreator(_tokenId, creatorTokens[_tokenId].creatorAddress);
		}
	}

	// Allow user to sell a given CreatorToken back to the platform
	function sellCreatorToken(uint _tokenId, uint _amount, address payable _seller) external payable {
		// Require that user calling function is selling own tokens
		require(_seller == msg.sender);
		// Initialize proceeds required
		uint proceedsRequired = 0;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Compute sale proceeds required
		proceedsRequired = _saleFunction(startingSupply, _amount, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		// Compute fee
		uint fee = proceedsRequired*platformFee/100;
		// Add platform fee to obtain real proceedsRequired value
		proceedsRequired -= fee;
		// Burn _amount tokens from user's address (note this decreases token amount outstanding)
		burn(_seller, _tokenId, _amount);
		// Send user proceedsRequired wei (less the platform fee) in exchange for the burned tokens
		_seller.transfer(proceedsRequired); //1500000000000000000); //
		// Update platform fee total
		_platformFeeUpdater(fee);
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// Transfer excess liquidity (triggered only when a CreatorToken hits a new maxSupply)
	function _payCreator(uint _tokenId, address payable _creatorAddress) internal {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Initialize totalProfit
		uint totalProfit = 0;
		// Calculate totalProfit (area between b(x) and s(x) from 0 to maxSupply)
		totalProfit = _buyFunction(0, creatorTokens[_tokenId].maxSupply, mNumerator, mDenominator) - _saleFunction(creatorTokens[_tokenId].maxSupply, creatorTokens[_tokenId].maxSupply, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		// Calculate creator's new profit created from new excess liquidity created
		uint newProfit = totalProfit - alreadyTransferred; //400000000000000000; // 
		// Transfer newProfit wei to creator
		_creatorAddress.transfer(newProfit);
		// Update amount of value transferred to creator
		tokenValueTransferred[_tokenId] = totalProfit;
	}
}
