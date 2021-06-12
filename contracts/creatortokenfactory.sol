// figure out which version you need to use
pragma solidity ^0.4.25;

import "./ownable.sol";
import "./safemath.sol";

contract CreatorTokenFactory is Ownable {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;

	// Event that fires whenever a new CreatorToken is created
	event NewCreatorToken(uint tokenId, string name, string symbol)

	// Pay-on-top style platform fee on each transaction
	uint platformFee = 1/100; // e.g., if platformFee == 1/100, the platform earns 1% of each transaction's value
	// Variable to track total platform fees generated
	uint totalPlatformFees = 0 ether;
	// Variable to track platform fees owed, but not yet paid to owner
	uint platformFeesOwed = 0 ether;

	// Profit margin (percentage of total revenue) directed toward creator
	uint profitMargin = 20/100;
	// Slope of buy price function
	uint m = 9/100000;


	struct CreatorToken {
		address creatorAddress;
		string name;
		string symbol;
		string description;
		bool verified;
		uint outstanding;
		uint maxSupply;
	}

	// Array of all CreatorTokens
	CreatorToken[] public creatorTokens;

	// Mapping from tokenId to creatorAddress
	mapping (uint => address) public tokenToCreator;
	// Mapping from tokenId to token value transferred (to creator/platform)
	mapping (uint => uint) private tokenValueTransferred;

	// Create a new CreatorToken
	function _createCreatorToken(address _creatorAddress, string _name, string _symbol, string _description) internal {
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