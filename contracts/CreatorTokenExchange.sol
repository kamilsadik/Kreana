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
		uint totalProceeds = _totalProceeds(_tokenId, _amount);
		// Require that user sends totalProceeds in order to transact
		require(msg.value == totalProceeds);
		// Update platform fee total
		_platformFeeUpdater(_feeProceeds(_buyProceeds(_tokenId, _amount)));
		// Mint _amount tokens at the user's address (note this increases token amount outstanding)
		_mint(msg.sender, _tokenId, _amount, "");
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
		// Compute sale proceeds required
		uint proceedsRequired = _saleFunction(creatorTokens[_tokenId].outstanding, _amount, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		// Compute fee
		uint fee = proceedsRequired*platformFee/100;
		// Add platform fee to obtain real proceedsRequired value
		proceedsRequired -= fee;
		// Burn _amount tokens from user's address (note this decreases token amount outstanding)
		_burn(_seller, _tokenId, _amount);
		// Send user proceedsRequired wei (less the platform fee) in exchange for the burned tokens
		_seller.transfer(proceedsRequired); //1500000000000000000); //
		// Update platform fee total
		_platformFeeUpdater(fee);
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}
}
