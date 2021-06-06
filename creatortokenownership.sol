// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenhelper.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC20 {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;

	// newtransaction event
	event NewTransaction(uint amount, string type, uint tokenId, string name, string symbol) //add in whatever other params are necessary


	// implement the functions (and trigger the events) included in ERC20.sol. possibilities include:
	//     balanceOf
	//     transferFrom
	//     approve

	// create a buyCreatorToken function (fnc of amount being bought) <= might make this private, and call it in a payable ERC-20 fnc
	function buyCreatorToken(uint _tokenId, uint _amount) external {
		// increase outstanding amount of token by amount
		creatorTokens[_tokenId].outstanding.add(_amount);
		// if token amount outstanding > max supply, update max supply (and call value transfer function?)
		if (creatorTokens[_tokenId].outstanding > creatorTokens[_tokenId].maxSupply) {
			creatorTokens[_tokenId].maxSupply = creatorTokens[_tokenId].outstanding;
			// call _payout to transfer excess liquidity
			_payout(_tokenId);
		}
		// DAMM  MATH => calculate AUC (buy_price_fnc) to compute cost of amount tokens

		// emit newtransaction event
		emit NewTransaction(_amount, "buy", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
		// mint amount of tokens (automatically triggers Transfer event)
		_mint(msg.sender, _amount);
	}

	// create a sellCreatorToken function (fnc of amount being sold) <= might make this private, and call it in a payable ERC-20 fnc
	function sellCreatorToken(uint _tokenId, uint _amount) external {
		// decrease outstanding amount of token by amount
		creatorTokens[_tokenId].outstanding.sub(_amount);
		// DAMM  MATH => calculate AUC (sale_price_fnc) to compute proceeds earned for amount of tokens sold

		// emit newtransaction event
		emit NewTransaction(_amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
		// burn amount of tokens (automatically triggers Transfer event)
		_burn(msg.sender, _amount);
	}

	// create function transferring excess liquidity to creator/protocol wallet when we hit a new maxSupply
	function _payout(uint _tokenId) private {
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// DAMM MATH => calculate how much more value needs to be transferred
		uint totalRevenue = 0;
		// transfer diff between totalRevenue and alreadyTransferred
		transferFrom(protocolWallet, creatorTokens.creatorTokens[_tokenId], totalRevenue-alreadyTransferred);
	}


}