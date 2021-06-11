// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenhelper.sol";
import "./erc1155.sol";
import "./safemath.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC1155PresetMinterPauser {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;

	// Event that fires when a new transaction occurs
	event NewTransaction(uint amount, string type, uint tokenId, string name, string symbol) //add in whatever other params are necessary

	// Allow user to buy a given CreatorToken from the platform
	function buyCreatorToken(uint _tokenId, uint _amount) external payable {
		// Initialize proceeds required;
		uint proceedsRequired = 0 ether;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Iterate to compute buy proceeds required
		for (uint i = startingSupply.add(1), i<startingSupply.add(_amount).add(1), i++) {
			proceedsRequired = proceedsRequired.add(_buyFunction(i, m));
		}
		// Make sure that user sends proceedsRequired ether to cover the cost of _amount tokens, plus the platform fee
		require(msg.value == proceedsRequired.mul((1.add(platformFee))));
		// Update platform fee total
		_platformFeeUpdater(proceedsRequired);
		// Mint _amount tokens at the user's address
		mint(msg.sender, _tokenId, _amount);
		// Emit new transaction event
		emit NewTransaction(_amount, "buy", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
		// Increase outstanding amount of token by _amount
		creatorTokens[_tokenId].outstanding.add(_amount);
		// Check if new outstanding amount of token is greater than maxSupply
		if (creatorTokens[_tokenId].outstanding > creatorTokens[_tokenId].maxSupply) {
			// Update maxSupply
			creatorTokens[_tokenId].maxSupply = creatorTokens[_tokenId].outstanding;
			// Call _payout to transfer excess liquidity
			_payCreator(_tokenId);
		}
	}

	// Create a linear buy price function wtih slope _m
	function _buyFunction(uint _x, uint _m) private {
		return _m.mul(_x);
	}

	// Allow user to sell a given CreatorToken back to the platform
	function sellCreatorToken(uint _tokenId, uint _amount) external payable {
		// Initialize proceeds required
		uint proceedsRequired = 0 ether;
		// Initialize pre-transaction supply
		uint startingSupply = creatorTokens[_tokenId].outstanding;
		// Iterate to compute sale proceeds required
		for (uint i = startingSupply.add(1), startingSupply.sub(_amount).add(1), i--) {
			proceedsRequired = proceedsRequired.add(_saleFunction(_tokenId, i, m, creatorTokens[_tokenId].maxSupply, profitMargin));
		}
		// Burn _amount tokens from user's address
		burn(msg.sender, _tokenId, _amount);
		// Send user proceedsRequired ether in exchange for the burned tokens, less the platform fee
		// Note we don't transfer the platform fee to the owner, since owner is able to withdraw anyway
		msg.sender.transfer(proceedsRequired.mul((1.sub(platformFee))));
		// Update platform fee total
		_platformFeeUpdater(proceedsRequired);
		// Emit new transaction event
		emit NewTransaction(_amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
		// Decrease outstanding amount of token by _amount
		creatorTokens[_tokenId].outstanding.sub(_amount);
	}

	// Create a piecewise-defined sale price function based on slop of b(x), maxSupply, and profitMargin
	function _saleFunction(uint _tokenId, uint _x, uint _m, uint _maxSupply, uint _profitMargin) external {
		// Define breakpoint (a,b) chosen s.t. area under sale price function is (1-profitMargin) times area under buy price function
		uint a = _maxSupply.div(2);
		uint b = (2.mul((1.sub(_profitMargin))).mul(_maxSupply).mul(_m).sub(_maxSupply.mul(_m))).div(2);

		// Create the piecewise defined function
		if (0<=_x<=a) {
			return (b.div(a)).div(mul((x.sub(a)))).add(b);
		} else if (a<x<=_maxSupply) {
			return ((_m.mul(_maxSupply).sub(b)).div((_maxSupply.sub(a)))).mul((_x.sub(a))).add(b);
		}
	}

	// Transfer excess liquidity (triggered only when a CreatorToken hits a new maxSupply)
	function _payCreator(uint _tokenId) private {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Initialize totalProfit
		uint totalProfit = 0 ether;
		// Calculate totalProfit (integral from 0 to maxSupply of b(x) - s(x) dx)
		for (uint i = 1, creatorTokens[_tokenId].maxSupply, i++) {
			totalProfit += _buyFunction(i, m) - _saleFunction(_tokenId, i, m, creatorTokens[_tokenId].maxSupply, profitMargin);
		}
		// Calculate creator's new profit created from new excess liquidity created
		uint newProfit = totalProfit.sub(alreadyTransferred);
		// Transfer newProfit ether to creator
		creatorTokens.creatorAddress[_tokenId].transfer(newProfit);
		// Update amount of value transferred to creator
		tokenValueTransferred[_tokenId] = totalProfit;
	}

	// Update platform fees tracker
	function _platformFeeUpdater(uint _proceedsRequired) private {
		totalPlatformFees = totalPlatformFees.add(_proceedsRequired.mul(platformFee));
		platformFeesOwed = platformFeesOwed.add(_proceedsRequired.mul(platformFee));
	}
}







