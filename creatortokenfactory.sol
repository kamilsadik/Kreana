// figure out which version you need to use
pragma solidity ^0.4.25;

import "./ownable.sol";
import "./safemath.sol";

contract CreatorTokenFactory is Ownable {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;

	// Event that fires whenever a new CreatorToken is created
	event NewCreatorToken(uint tokenId, string name, string symbol) //add in whatever other params are necessary

	// Pay-on-top style platform fee on each transaction
	uint platformFee = 0.10; // e.g., if platformFee == 0.01, the platform earns 1% of each transaction's value

	// Address of liquidityPool (might not need this... doesn't the smart contract itself have an address?)
	address liquidtyPool;
	// Address where platform's cut gets routed
	address platformWallet;

	struct CreatorToken {
		address creatorAddress;
		string name;
		string symbol,
		string description;
		bool verified;
		uint16 outstanding; //optimize which uint you use
		uint16 maxSupply; //optimize which uint you use
	}

	// Array of all CreatorTokens
	CreatorToken[] public creatorTokens;

	// Mapping from tokenId to creatorAddress
	mapping (uint => address) public tokenToCreator;
	// Mapping from tokenId to token value transferred (to creator/platform)
	mapping (uint => uint) private tokenValueTransferred;

	// Create a new CreatorToken
	function _createCreatorToken(address _creatorAddress, string _name, string, _symbol, string _description) internal {
		// Create token id, and add token to creatorTokens array
		uint id = creatorTokens.push(CreatorToken(_creatorAddress, _name, _symbol, _description, False, 0, 0)) - 1;
		// Map from token id to creator's address
		tokenToCreator[id] = _creatorAddress;
		// Map from token id to amount of value transferred (0 at inception)
		tokenValueTransferred[id] = 0;
		// Emit token creation event
		emit NewCreatorToken(id, _name, _symbol);
	}
}