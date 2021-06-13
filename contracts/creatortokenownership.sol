// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenhelper.sol";
import "./erc1155.sol";
//import "./safemath.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC1155PresetMinterPauser {

	//using SafeMath for uint256;
	//using SafeMath32 for uint32;
	//using SafeMath16 for uint16;

	constructor() public ERC1155PresetMinterPauser() { }

	// Mint a token
	function mint(address _to, uint256 _id, uint256 _amount, bytes memory _data) public {
		// Call _createCreatorToken
	}

	// Mint a batch of tokens
	function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory data) public {
		// _createCreatorToken
	}

	// Burn a token
	function burn(address _account, uint256 _id, uint256 _value) public {
		// transfer tokens from that account to 0 adddress
	}

	// Burn a batch of tokens
	function burnBatch(address account, uint256[] memory _ids, uint256[] memory _amounts) public {
		// transfer tokens fromthat account to 0 address
	}

	// Transfer a token
	function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) public {
		// transfer from _from to _to?
	}
	// Transfer a batchof tokens
	function safeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory data) public {
		// transfer from _from to _to?
	}

	// Return balance of a given token at a given address
	function balanceOf(address _account, uint256 _id) external view returns (uint256) {
		// use a mapping showing balances
	}
	// Return balance of a batch of tokens
	function balanceOfBatch(address[] calldata _accounts, uint256[] calldata _ids) external view returns (uint256) {
		// use a mapping showing balances
	}

	// Give operator permission to transfer caller's tokens
	function setApprovalForAll(address _operator, bool approved) external  {
		// use a mapping showing approvals
	}
	// Denotes whether operator is approved to transfer accounts' tokens
	function isApprovedForAll(address _account, address _operator) external {
		// use a mapping showing approvals
	}






}







