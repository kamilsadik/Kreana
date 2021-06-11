
// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenfactor.sol";

contract CreatorTokenHelper is CreatorTokenFactory {

	// Modifier checking whether user is creator of the token
	modifier onlyCreatorOf(uint _tokenId) {
		require(msg.sender == tokenToCreator[_tokenId]);
		_;
	}

	// Ownable function allowing for withdrawal
	function withdraw() external onlyOwner {
	  address _owner = owner();
	  _owner.transfer(address(this).balance);
	}

	// Allow owner to change platformWallet
	function changeWallet(address _newPlatformWallet) external onlyOwner {
		platformWallet = _newPlatformWallet;
	}

	// Allow owner to change platformFee
	function changePlatformFee(uint _newPlatformFee) external onlyOwner {
		platformFee = _newPlatformFee;
	}

	// Allow owner to change profit_margin
	function changeProfitMargin(address _newProfitMargin) external onlyOwner {
		profitMargin = _newProfitMargin;
	}

	// Allow owner to verify (or undo verification) of a CreatorToken
	function changeVerification(uint _tokenId, bool _verified) external onlyOwner {
		creatorTokens[_tokenId].verified = _verified;
	}

	// Allow token creator to change their address
	function changeAddress(uint _tokenId, address _newCreatorAddress) external onlyCreatorOf {
		creatorTokens[_tokenId].creatorAddress = _newCreatorAddress;
	}

	// Allow token creator to change the name of their token
	function changeName(uint _tokenId, string _newName) external onlyCreatorOf {
		creatorTokens[_tokenId].name = _newName;
	}

	// Allow token creator to change the symbol of their token
	function changeName(uint _tokenId, string _newSymbol) external onlyCreatorOf {
		creatorTokens[_tokenId].symbol = _newSymbol;
	}

	// Allow token creator to change the description of their token
	function changeDescriptoin(uint _tokenId, string _newDescription) external onlyCreatorOf {
		creatorTokens[_tokenId] = _newDescription;
	}
}