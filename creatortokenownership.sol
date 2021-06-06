// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenhelper.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC20 {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;

	// newtransaction event
	event NewTransaction(uint amount, string type, uint tokenId, string name, string symbol) //add in whatever other params are necessary

	// create a buyCreatorToken function (fnc of amount being bought) <= might make this private, and call it in a payable ERC-20 fnc
	function buyCreatorToken(uint _tokenId, uint _amount) external payable {
		// increase outstanding amount of token by amount
		creatorTokens[_tokenId].outstanding.add(_amount);
		// if token amount outstanding > max supply
		if (creatorTokens[_tokenId].outstanding > creatorTokens[_tokenId].maxSupply) {
			// update maxSupply
			creatorTokens[_tokenId].maxSupply = creatorTokens[_tokenId].outstanding;
			// call _payout to transfer excess liquidity
			_payout(_tokenId);
		}
		// DAMM  MATH => calculate AUC (buy_price_fnc) to compute cost of amount tokens in ether
		uint proceedsRequired = 0 ether;
		// make sure user sends enough ether to cover cost of tokens
		require(msg.value == proceedsRequired);
		// mint amount of tokens (automatically triggers Transfer event)
		_mint(msg.sender, _amount);
		// emit newtransaction event
		emit NewTransaction(_amount, "buy", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// create a sellCreatorToken function (fnc of amount being sold) <= might make this private, and call it in a payable ERC-20 fnc
	function sellCreatorToken(uint _tokenId, uint _amount) external payable {
		// decrease outstanding amount of token by amount
		creatorTokens[_tokenId].outstanding.sub(_amount);
		// DAMM  MATH => calculate AUC (sale_price_fnc) to compute proceeds earned for amount of tokens sold
		uint proceedsRequired = 0 ether;
		// burn amount of tokens (automatically triggers Transfer event)
		_burn(msg.sender, _amount);
		// send user enough ether to cover cost of tokens (make sure this can only get triggered if tokens are successfully burned)
		_transfer(liquidityPool, msg.sender, proceedsRequired);
		// emit newtransaction event
		emit NewTransaction(_amount, "sell", _tokenId, creatorTokens[_tokenId].name, creatorTokens[_tokenId].symbol);
	}

	// transfer excess liquidity to creator/platform wallet when we hit a new maxSupply
	function _payout(uint _tokenId) private {
		uint alreadyTransferred = tokenValueTransferred[_tokenId];
		// DAMM MATH => calculate area between buy price func and sale price func from 0 to maxSupply
		uint totalRevenue = 0;

		// calculate creator's cut
		uint creatorCut = (totalRevenue - alreadyTransferred) * (1 - platformFee);
		// transfer creator's cut to creator
		_transfer(liquidityPool, creatorTokens.creatorTokens[_tokenId], creatorCut);

		// calculate platform's cut
		uint platformCut = (totalRevenue - alreadyTransferred) * platformFee;
		// transfer platform fee to platform wallet
		_transfer(liquidityPool, platformWallet, platformCut);
	}
}




