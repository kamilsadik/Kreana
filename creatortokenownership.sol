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
		// Make sure that user sends proceedsRequired ether to cover the cost of _amount tokens, plus the platform fee
		require(msg.value == proceedsRequired * (1 + platformFee));
		// Mint _amount tokens at the user's address
		mint(msg.sender, _tokenId, _amount);
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
		burn(msg.sender, _tokenId, _amount);
		// Send user proceedsRequired ether in exchange for the burned tokens, less the platform fee
		msg.sender.transfer(proceedsRequired * (1 - platformFee));
		// Emit new transaction event
		emit NewTransaction(_amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// Transfer excess liquidity (triggered only when a CreatorToken hits a new maxSupply)
	function _payout(uint _tokenId) private {
		// Create a variable showing excess liquidity that has already been transferred out of this token's liquidity pool
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// Calculate totalProfit (integral from 0 to maxSupply of b(x) - s(x) dx)
		uint totalProfit = 0;

		// Calculate creator's new profit from remaining excess liquidity to be transferred
		uint newProfit = totalProfit - alreadyTransferred
		// Transfer creatorCut ether to creator
		creatorTokens.creatorAddress[_tokenId].transfer(newProfit); // is this the right function? I want to transfer eth...
	}
}