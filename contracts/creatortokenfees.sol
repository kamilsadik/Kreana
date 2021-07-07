// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenformulas.sol";

contract CreatorTokenFees is CreatorTokenFormulas {

	constructor(string memory uri) CreatorTokenFormulas(uri) { }

	// Calculate fee associated with buy transaction
	function _feeProceeds(uint _proceedsRequired) public view returns (uint256) {
		return _proceedsRequired*platformFee/100;
	}

	// Update platform fees tracker
	function _platformFeeUpdater(uint _fee) internal {
		totalPlatformFees += _fee;
		platformFeesOwed += _fee;
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