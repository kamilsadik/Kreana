
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

	// allows owner to verify a token (or to switch verification back to false if necessary)
	function changeVerification(uint _tokenId, bool _verified) external onlyOwner {
		creatorTokens[_tokenId].verified = _verified;
	}

	// function letting user change address (onlyCreatorOf token id)
	function changeAddress(uint _tokenId, address _newCreatorAddress) external onlyCreatorOf {
		creatorTokens[_tokenId].creatorAddress = _newCreatorAddress;
	}

	// function letting user change name (onlyCreatorOf token id)
	function changeName(uint _tokenId, string _newName) external onlyCreatorOf {
		creatorTokens[_tokenId].name = _newName;
	}

	// function letting user change description (onlyCreatorOf token id)
	function changeDescriptoin(uint _tokenId, string _newDescription) external onlyCreatorOf {
		creatorTokens[_tokenId] = _newDescription;
	}
}