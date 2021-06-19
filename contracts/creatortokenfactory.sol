// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";

contract CreatorTokenFactory is Ownable {

	// Event that fires whenever a new CreatorToken is created
	event NewCreatorToken(uint tokenId, string name, string symbol);

	// Pay-on-top style platform fee on each transaction
	uint platformFee = 1; // e.g., if platformFee == 1/, the platform earns 1% of each transaction's value
	// Variable to track total platform fees generated
	uint totalPlatformFees = 0 ether;
	// Variable to track platform fees owed, but not yet paid to owner
	uint platformFeesOwed = 0 ether;

	// Profit margin (percentage of total revenue) directed toward creator
	uint profitMargin = 20;

	// Slope of buy price function
	uint m_numerator = 9;
	uint m_denominator = 100000;
	uint m = m_numerator/m_denominator;

	struct CreatorToken {
		address payable creatorAddress;
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
	mapping (uint => uint) internal tokenValueTransferred;
	// Mapping from tokenId to mapping from address to quantity of tokenId held
	mapping(uint256 => mapping(address => uint256)) public tokenHoldership;
	// Mapping from user to mapping from tokenId to quantity of that token the user owns (to show a user's portfolio without having to iterate through tokenHoldership)
	mapping(address => mapping(uint256 => uint256)) public userToHoldings;
	// Mapping from account to operator approvals
	mapping(address => mapping(address => bool)) internal approvals;

	// Create a new CreatorToken
	function createCreatorToken(address payable _creatorAddress, string memory _name, string memory _symbol, string memory _description) public {
		// Add token to creatorTokens array
		creatorTokens.push(CreatorToken(_creatorAddress, _name, _symbol, _description, false, 0, 0));
		// Create token id
		uint id = creatorTokens.length - 1;
		// Map from token id to creator's address
		tokenToCreator[id] = _creatorAddress;
		// Map from token id to amount of value transferred (0 at inception)
		tokenValueTransferred[id] = 0;
		// Emit token creation event
		emit NewCreatorToken(id, _name, _symbol);
	}


}