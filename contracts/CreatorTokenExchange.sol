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
		uint proceedsRequired = 0;
		// Calculate proceeds required
		proceedsRequired = _buyProceeds(_tokenId, _amount);
		// Make sure that user sends proceedsRequired wei to cover the cost of _amount tokens, plus the platform fee
		require(msg.value == proceedsRequired);//== 2000000000000000000);//
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

	// Calculate proceedsRequired to for a given buy transaction
	function _buyProceeds(uint _tokenId, uint _amount) public view returns (uint256) {
		// Initialize proceeds required;
		uint proceedsRequired = 0;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Compute post-transaction supply
		uint endSupply = startingSupply + _amount;
		// Compute buy proceeds
		// Check if endSupply <= maxSupply
		if (endSupply < creatorTokens[_tokenId].maxSupply) {
			// Scenario in which entire transaction takes place below maxSupply
			// Just call s(x)
			proceedsRequired = _saleFunction(startingSupply, _amount, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
		} else if (startingSupply < creatorTokens[_tokenId].maxSupply){
			// Scenario in which supply begins below maxSupply and ends above pre-transaction maxSupply
			// Use s(x) from startingSupply to maxSupply
			proceedsRequired = _saleFunction(creatorTokens[_tokenId].maxSupply, creatorTokens[_tokenId].maxSupply - startingSupply, mNumerator, mDenominator, creatorTokens[_tokenId].maxSupply, profitMargin);
			// Use b(x) from maxSupply to endSupply
			proceedsRequired += _buyFunction(creatorTokens[_tokenId].maxSupply, _amount - (creatorTokens[_tokenId].maxSupply - startingSupply), mNumerator, mDenominator);
		} else {
			// Scenario in which transaction begins at maxSupply
			// Just call b(x)
			proceedsRequired = _buyFunction(startingSupply, _amount, mNumerator, mDenominator);
		}
		// Compute fee
		uint fee = proceedsRequired*platformFee/100;
		// Update platform fee total
		_platformFeeUpdater(fee);
		// Add platform fee to obtain total transaction proceeds required
		proceedsRequired += fee;
		// Return total proceeds required
		return proceedsRequired;
	}
	
	// Calculate area under buy price function
	function _buyFunction(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator) private pure returns (uint256) {
		// b(x) = m*x
		uint endSupply = _startingSupply + _amount;
		uint base1 = _mNumerator*_startingSupply/_mDenominator;
		uint base2 = _mNumerator*endSupply/_mDenominator;
		uint height = endSupply-_startingSupply;
		uint area = (base1 + base2) * height / 2;
		return area;
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
		proceedsRequired -= fee
		// Burn _amount tokens from user's address (note this decreases token amount outstanding)
		burn(_seller, _tokenId, _amount);
		// Send user proceedsRequired wei (less the platform fee) in exchange for the burned tokens
		_seller.transfer(proceedsRequired); //1500000000000000000); //
		// Update platform fee total
		_platformFeeUpdater(fee);
		// Emit new transaction event
		emit NewTransaction(msg.sender, _amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// Calculate area under sale price function
	function _saleFunction(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator, uint _maxSupply, uint _profitMargin) private pure returns (uint256) {
		// Calculate breakpoint and endSupply
		(uint a, uint b, uint endSupply) = _breakpoint(_startingSupply, _amount, _mNumerator, _mDenominator, _maxSupply, _profitMargin);
		// Initialize area under curve
		uint area = 0;
		// Check where _startingSupply is relative to the breakpoint
		if (_startingSupply < a) {
			// Just need trapezoidal area of partial entirely left of the breakpoint
			area = _leftArea(a, b, _startingSupply, endSupply);
		} else if (endSupply < a) {
			// Scenario in which _startingSupply >= a, and endSupply < a
			// There, need trapezoidal area of components both to right and left of breakpoint
			area = _bothArea(a, b, _startingSupply, endSupply, _mNumerator, _mDenominator, _maxSupply);
		} else {
			// Scenario in which entire sale occurs to right of breakpoint
			// Just need trapezoidal area of partial entirely right of the breakpoint
			area = _rightArea(a, b, _startingSupply, endSupply, _mNumerator, _mDenominator, _maxSupply);
		}
		return area;
	}

	// Calculate breakpoint and other key inputs into _saleFunction
	function _breakpoint(uint _startingSupply, uint _amount, uint _mNumerator, uint _mDenominator, uint _maxSupply, uint _profitMargin) private pure returns (uint, uint, uint) {
		// Define breakpoint (a,b) chosen s.t. area under sale price function is (1-profitMargin) times area under buy price function
		uint a = _maxSupply/2;
		uint b = _maxSupply*(50-_profitMargin)/100*_mNumerator/_mDenominator;
		uint endSupply = _startingSupply - _amount;
		return (a, b, endSupply);
	}

	// _saleFunction scenario in which entire transaction occurs left of breakpoint
	function _leftArea(uint _a, uint _b, uint _startingSupply, uint _endSupply) private pure returns (uint256) {
			//uint base1 = ((_b/_a)*(_a-_endSupply)+_b);
			//uint base1 = ((_b/_a)*(_endSupply-_a)+_b);
			uint base1 = (_b-(_b/_a)*(_a-_endSupply));
			//uint base2 = ((_b/_a)*(_a-_startingSupply)+_b);
			//uint base2 = ((_b/_a)*(_startingSupply-_a)+_b);
			uint base2 = (_b-(_b/_a)*(_a-_startingSupply));
			uint height = _startingSupply-_endSupply;
			return (base1 + base2) * height / 2;
	}

	// _saleFunction scenario in which transaction crosses breakpoint
	function _bothArea(uint _a, uint _b, uint _startingSupply, uint _endSupply, uint _mNumerator, uint _mDenominator, uint _maxSupply) private pure returns (uint256) {
		//uint leftBase1 = ((_b/_a)*(_a-_endSupply)+_b);
		//uint leftBase1 = ((_b/_a)*(_endSupply-_a)+_b);
		uint leftBase1 = (_b-(_b/_a)*(_a-_endSupply));
		uint sharedBase = _b;
		uint leftHeight = _a-_endSupply;
		uint leftArea = (leftBase1 + sharedBase) * leftHeight / 2;
		uint rightBase2 = (_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a)*(_startingSupply-_a)+_b;
		uint rightHeight = _startingSupply-_a;
		uint rightArea = (sharedBase + rightBase2) * rightHeight / 2;
		return leftArea + rightArea;
	}

	// _saleFunction scneario in which entire transaction occurs right of breakpoint
	function _rightArea(uint _a, uint _b, uint _startingSupply, uint _endSupply, uint _mNumerator, uint _mDenominator, uint _maxSupply) private pure returns (uint256) {
		uint base1 = (((_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a))*(_endSupply-_a)+_b);
		uint base2 = (((_mNumerator*_maxSupply/_mDenominator-_b)/(_maxSupply-_a))*(_startingSupply-_a)+_b);
		uint height = _startingSupply-_endSupply;
		return (base1 + base2) * height / 2;
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

	// Update platform fees tracker
	function _platformFeeUpdater(uint _fee) internal {
		totalPlatformFees += _fee;
		platformFeesOwed += _fee;
	}
}
