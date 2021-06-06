// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenhelper.sol";
import "./erc1155.sol";
import "./safemath.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC1155PresetMinterPauser {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;


	// Might need to override all the ERC-20 functions I'm using so that I can
	// also specify the tokenId in question. See how CryptoZombies does this.

	// Event that fires whena new transaction occurs
	event NewTransaction(uint amount, string type, uint tokenId, string name, string symbol) //add in whatever other params are necessary

	// Allow user to buy a given CreatorToken from the platform
	function buyCreatorToken(uint _tokenId, uint _amount) external payable {
		// Increase outstanding amount of token by _amount
		creatorTokens[_tokenId].outstanding.add(_amount);
		// Check if new outstanding amount of token is greater than maxSupply
		if (creatorTokens[_tokenId].outstanding > creatorTokens[_tokenId].maxSupply) {
			// Update maxSupply
			creatorTokens[_tokenId].maxSupply = creatorTokens[_tokenId].outstanding;
			// Call _payout to transfer excess liquidity
			_payout(_tokenId);
		}
		// Calculate proceedsRequired in order for user to buy _amount tokens (unclear if this calc will be done off-chain via AWS Lambda, or on-chain)
		uint proceedsRequired = 0 ether;
		// Make sure that user sends enough ether to cover the cost of _amount tokens
		require(msg.value == proceedsRequired);
		// Mint _amount tokens at the user's address
		_mint(msg.sender, _amount);
		// Emit new transaction event
		emit NewTransaction(_amount, "buy", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// Allow user to sell a given CreatorToken back to the platform
	function sellCreatorToken(uint _tokenId, uint _amount) external payable {
		// Decrease outstanding amount of token by _amount
		creatorTokens[_tokenId].outstanding.sub(_amount);
		// Calculate proceedsRequired in order to buy back _amount tokens from user (unclear if this calc will be done off-chain via AWS Lambda, or on-chain)
		uint proceedsRequired = 0 ether;
		// Burn _amount tokens from user's address
		_burn(msg.sender, _amount);
		// Send user proceedsRequired in exchange for the burned tokens
		_transfer(liquidityPool, msg.sender, proceedsRequired);
		// Emit new transaction event
		emit NewTransaction(_amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// Transfer excess liquidity (triggered only when a CreatorToken hits a new maxSupply)
	function _payout(uint _tokenId) private {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Calculate totalProfit (integral from 0 to maxSupply of b(x) - s(x) dx)
		uint totalProfit = 0;

		// Calculate creator's cut of remaining excess liquidity to be transferred
		uint creatorCut = (totalProfit - alreadyTransferred) * (1 - platformFee);
		// Transfer creator's cut to creator
		_transfer(liquidityPool, creatorTokens.creatorAddress[_tokenId], creatorCut); // is this the right function? I want to transfer eth...

		// Calculate platform's cut of remaining excess liquidity to be transferred
		uint platformCut = (totalProfit - alreadyTransferred) * platformFee;
		// Transform platform fee to platform wallet
		_transfer(liquidityPool, platformWallet, platformCut); // is this the right function? I want to transfer eth...
	}
}




