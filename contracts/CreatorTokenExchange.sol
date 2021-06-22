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
		// Compute post-transaction supply
		uint endSupply = startingSupply + _amount;

		// Compute buy proceeds
		// Check if endSupply <= maxSupply
		if (endSupply < creatorTokens[_tokenId].maxSupply) {
			// Scenario in which entire transaction takes place below maxSupply
			// Just call s(x)
			proceedsRequired += ;
			// Call b(x) from maxSupply to endSupply
		} else if (startingSupply < creatorTokens[_tokenId].maxSupply){
			// Scenario in which supply begins below maxSupply and ends above pre-transaction maxSupply
			// Use s(x) from startingSupply to maxSupply
			// Use b(x) from maxSupply to endSupply
		} else {
			// Scenario in which transaction begins at maxSupply
			// Just call b(x)
		}
		// Find area under b(x) from maxSupply to endSupply (maxSupply or startingSupply + _amount)
		proceedsRequired += ;


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
		require(msg.value == 20000000000000000000);//(proceedsRequired + proceedsRequired*platformFee/100));
		// Update platform fee total
		_platformFeeUpdater(proceedsRequired);
		// Mint _amount tokens at the user's address (note this increases token amount outstanding)
		mint(msg.sender, _tokenId, _amount, "");
		// Update tokenHoldership mapping
		tokenHoldership[_tokenId][msg.sender] += _amount;
		// Update userToHoldings mapping
		userToHoldings[msg.sender][_tokenId] += _amount;
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

	// Calculate area under buy price function
	function _buyFunction(uint _startingSupply, uint _amount, uint _m) private pure returns (uint256) {
		// b(x) = m*x
		uint endSupply = _startingSupply + _amount;
		uint base1 = _m*_startingSupply;
		uint base2 = _m*endSupply;
		uint height = endSupply-_startingSupply;
		uint area = (base1 + base2) * height / 2;
		return area
	}

	// Allow user to sell a given CreatorToken back to the platform
	function sellCreatorToken(uint _tokenId, uint _amount, address payable _seller) external payable {
		// Require that user calling function is selling own tokens
		require(_seller == msg.sender);
		// Initialize proceeds required
		uint proceedsRequired = 0 ether;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Compute sale proceeds required
		proceedsRequired = _saleFunction(startingSupply, _amount, m, creatorTokens[_tokenId].maxSupply, profitMargin)
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

	// Calculate area under sale price function
	function _saleFunction(uint _startingSupply, uint _amount, uint _m, uint _maxSupply, uint _profitMargin) private pure returns (uint256) {
		// Define breakpoint (a,b) chosen s.t. area under sale price function is (1-profitMargin) times area under buy price function
		uint a = _maxSupply/2;
		uint b = ((2-2*_profitMargin/100)*_maxSupply*_m - _maxSupply*_m)/2;
		uint endSupply = _startingSupply - _amount;
		// Check where _startingSupply is relative to the breakpoint
		if (_startingSupply < a) {
			// Just need trapezoidal area of partial entirely left of the breakpoint
			uint base1 = ((b/a)*(a-endSupply)+b);
			uint base2 = ((b/a)*(a-_startingSupply)+b);
			uint height = _startingSupply-endSupply;
			uint area = (base1 + base2) * height / 2;
		} else if (endSupply < a) {
			// Scenario in which _startingSupply >= a, and endSupply < a
			// There, need trapezoidal area of components both to right and left of breakpoint
			uint leftBase1 = ((b/a)*(a-endSupply)+b);
			uint sharedBase = b;
			uint leftHeight = a-endSupply;
			uint leftArea = (leftBase1 + sharedBase) * leftHeight / 2;
			uint rightBase2 = (((_m*_maxSupply-b)/(_maxSupply-a))*(_startingSupply-a)+b);
			uint rightHeight = _startingSupply-a;
			uint rightArea = (sharedBase + rightBase2) * rightHeight / 2;
			uint area = leftArea + rightArea;
		} else {
			// Scenario in which entire sale occurs to right of breakpoint
			// Just need trapezoidal area of partial entirely right of the breakpoint
			uint base1 = (((_m*_maxSupply-b)/(_maxSupply-a))*(endSupply-a)+b);
			uint base2 = (((_m*_maxSupply-b)/(_maxSupply-a))*(_startingSupply-a)+b);
			uint height = _startingSupply-endSupply;
			uint area = (base1 + base2) * height / 2;
		}
		return area
	}

	// Transfer excess liquidity (triggered only when a CreatorToken hits a new maxSupply)
	function _payCreator(uint _tokenId, address payable _creatorAddress) internal {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Initialize totalProfit
		uint totalProfit = 0;

		// Calculate totalProfit (integral from 0 to maxSupply of b(x) - s(x) dx)
		for (uint i = 1; i<creatorTokens[_tokenId].maxSupply+1; i++) {
			totalProfit += (_buyFunction(i, m) - _saleFunction(_tokenId, i, m, creatorTokens[_tokenId].maxSupply, profitMargin));
		}

		// Calculate creator's new profit created from new excess liquidity created
		uint newProfit = 10000000000000000000;//totalProfit - alreadyTransferred;
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
