
// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenfactor.sol";

contract CreatorTokenHelper is CreatorTokenFactory {

	// modifier checking whether the user is the creator of the token
	modifier onlyCreatorOf(uint _tokenId) {
		require(msg.sender == tokenToCreator[_tokenId]);
		_;
	}

	// ownable function allowing for withdrawal
	function withdraw() external onlyOwner {
	  address _owner = owner();
	  _owner.transfer(address(this).balance);
	}

	// ownable function to verify a given creator token


	// function letting user change address (onlyCreatorOf token id)


	// function letting user change name (onlyCreatorOf token id)


	// function letting user change description (onlyCreatorOf token id)


	// function letting user change address (onlyCreatorOf token id)


}