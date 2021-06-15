// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenfactory.sol";

contract CreatorTokenHelper is CreatorTokenFactory {

	// Modifier checking whether user is creator of the token
	modifier onlyCreatorOf(uint _tokenId) {
		require(msg.sender == tokenToCreator[_tokenId]);
		_;
	}

	// Ownable function allowing for withdrawal
	function withdraw(address payable _owner) external onlyOwner {
	  _owner.transfer(address(this).balance);
	}

	// Payout platform fees owed to owner (might opt to call this daily)
	function payoutPlatformFees(address payable _owner) external onlyOwner {
		_owner.transfer(platformFeesOwed);
		// Reset platformFeesOwed to zero after payout
		platformFeesOwed = 0 ether;
	}

	// Allow owner to change platformFee
	function changePlatformFee(uint _newPlatformFee) external onlyOwner {
		platformFee = _newPlatformFee;
	}

	// Allow owner to change profit_margin
	function changeProfitMargin(uint _newProfitMargin) external onlyOwner {
		profitMargin = _newProfitMargin;
	}

	// Allow owner to verify (or undo verification) of a CreatorToken
	function changeVerification(uint _tokenId, bool _verified) external onlyOwner {
		creatorTokens[_tokenId].verified = _verified;
	}

	// Allow token creator to change their address
	function changeAddress(uint _tokenId, address _newCreatorAddress) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].creatorAddress = _newCreatorAddress;
	}

	// Allow token creator to change the name of their token
	function changeName(uint _tokenId, string calldata _newName) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].name = _newName;
	}

	// Allow token creator to change the symbol of their token
	function changeSymbol(uint _tokenId, string calldata _newSymbol) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].symbol = _newSymbol;
	}

	// Allow token creator to change the description of their token
	function changeDescriptoin(uint _tokenId, string calldata _newDescription) external onlyCreatorOf(_tokenId) {
		creatorTokens[_tokenId].description = _newDescription;
	}
}