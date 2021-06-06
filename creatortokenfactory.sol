// figure out which version you need to use
pragma solidity ^0.4.25;

import "./ownable.sol";
import "./safemath.sol";

contract CreatorTokenFactory is Ownable {

	using SafeMath for uint256;
	using SafeMath32 for uint32;
	using SafeMath16 for uint16;

	event NewCreatorToken(uint tokenId, string name) //add in whatever other params are necessary

	struct CreatorToken {
		address creatorAddress;
		string name;
		string description;
		bool verified;
		uint16 outstanding; //optimize which uint you use
		uint16 maxSupply; //optimize which uint you use
	}

	CreatorToken[] public creatorTokens;

	mapping (uint => address) public tokenToCreator; //maps token id (index of token in CreatorTokens) to creator
	mapping (uint => uint) private tokenValueTransferred; //shows amount of value transferred off-protocol for a given token

	function _createCreatorToken(address _creatorAddress, string _name, string _description) internal {
		uint id = creatorTokens.push(CreatorToken(_creatorAddress, _name, _description, False, 0, 0)) - 1; // create token id, and add token to list of tokens
		tokenToCreator[id] = _creatorAddress; // map this token id to the creator's address
		emit NewCreatorToken(id, _name); // emit token creation event
	}
}