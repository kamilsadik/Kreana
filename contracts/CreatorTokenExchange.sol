// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenownership.sol";

contract CreatorTokenExchange is CreatorTokenOwnership {

	constructor(string memory uri) CreatorTokenOwnership(uri) { }

	// Event that fires when a new transaction occurs
	event NewTransaction(address indexed account, uint amount, string transactionType, uint tokenId, string name, string symbol);

	// Allow user to buy a given CreatorToken from the platform
	function buyCreatorToken(uint _tokenId, uint _amount) external payable {
		// Initialize proceeds required;
		uint proceedsRequired = 0 ether;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Compute buy proceeds
		for (uint i = startingSupply+1; i<startingSupply+_amount+1; i++) {
			// If the current token number is < maxSupply
			if (i < creatorTokens[_tokenId].maxSupply) {
				// Then user is buying along sale price function
				proceedsRequired += _saleFunction(_tokenId, i, m, creatorTokens[_tokenId].maxSupply, profitMargin);
			} else { // Else (if the current token number is >= maxSupply)
				// Then user is buying along buy price function
				proceedsRequired += _buyFunction(i, m);
			}
		}
		// Make sure that user sends proceedsRequired ether to cover the cost of _amount tokens, plus the platform fee
		require(msg.value == proceedsRequired + proceedsRequired*platformFee/100);
		// Update platform fee total
		_platformFeeUpdater(proceedsRequired);
		// Mint _amount tokens at the user's address (note this increases token amount outstanding)
		mint(msg.sender, _tokenId, _amount, "");
		// Update tokenHoldership mapping
		tokenHoldership[_tokenId][msg.sender] = _amount;
		// Update userToHoldings mapping
		userToHoldings[msg.sender][_tokenId] = _amount;
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

	// Create a linear buy price function wtih slope _m
	function _buyFunction(uint _x, uint _m) private pure returns (uint256) {
		// b(x) = m*x
		return _m*_x;
	}

	// Allow user to sell a given CreatorToken back to the platform
	function sellCreatorToken(uint _tokenId, uint _amount, address payable _seller) external payable {
		// Require that user calling function is selling own tokens
		require(_seller == msg.sender);
		// Initialize proceeds required
		uint proceedsRequired = 0 ether;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Iterate to compute sale proceeds required
		for (uint i = startingSupply+1; i>startingSupply-_amount+1; i--) {
			proceedsRequired += _saleFunction(_tokenId, i, m, creatorTokens[_tokenId].maxSupply, profitMargin);
		}
		// Burn _amount tokens from user's address (note this decreases token amount outstanding)
		burn(_seller, _tokenId, _amount);
		// Send user proceedsRequired ether (less the platform fee) in exchange for the burned tokens
		_seller.transfer(proceedsRequired - proceedsRequired*platformFee/100);
		// Update tokenHoldership mapping
		tokenHoldership[_tokenId][msg.sender] = _amount;
		// Update userToHoldings mapping
		userToHoldings[msg.sender][_tokenId] = _amount;
		// Update platform fee total
		_platformFeeUpdater(proceedsRequired);
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// Create a piecewise-defined sale price function based on slope of b(x), maxSupply, and profitMargin
	function _saleFunction(uint _tokenId, uint _x, uint _m, uint _maxSupply, uint _profitMargin) private pure returns (uint256) {
		// Define breakpoint (a,b) chosen s.t. area under sale price function is (1-profitMargin) times area under buy price function
		uint a = _maxSupply/2;
		uint b = ((2-2*_profitMargin/100)*_maxSupply*_m - _maxSupply*_m)/2;
		// Create the piecewise defined function
		if (_x<=a) {
			return (b/a)*(_x-a)+b;
		} else if (_x<=_maxSupply) {
			return ((_m*_maxSupply-b)/(_maxSupply-a))*(_x-a)+b;
		}
	}

	// Transfer excess liquidity (triggered only when a CreatorToken hits a new maxSupply)
	function _payCreator(uint _tokenId, address payable _creatorAddress) internal {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Initialize totalProfit
		uint totalProfit = 0 ether;
		// Calculate totalProfit (integral from 0 to maxSupply of b(x) - s(x) dx)
		for (uint i = 1; i<creatorTokens[_tokenId].maxSupply+1; i++) {
			totalProfit += _buyFunction(i, m) - _saleFunction(_tokenId, i, m, creatorTokens[_tokenId].maxSupply, profitMargin);
		}
		// Calculate creator's new profit created from new excess liquidity created
		uint newProfit = totalProfit - alreadyTransferred;
		// Transfer newProfit ether to creator
		_creatorAddress.transfer(newProfit);
		// Update amount of value transferred to creator
		tokenValueTransferred[_tokenId] = totalProfit;
	}

	// Update platform fees tracker
	function _platformFeeUpdater(uint _proceedsRequired) internal {
		totalPlatformFees += _proceedsRequired*platformFee/100;
		platformFeesOwed += _proceedsRequired*platformFee/100;
	}
}
