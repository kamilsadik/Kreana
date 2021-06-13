// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./creatortokenhelper.sol";
import "./erc1155.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC1155PresetMinterPauser {

	constructor() public ERC1155PresetMinterPauser() { }

	// Mint a token
	function mint(address _to, uint256 _id, uint256 _amount, bytes memory _data) public {
		// Update tokenHoldership mapping
		tokenHoldership[_id][_to] += _amount;
		// Increase token amount outstanding
		creatorTokens[_id].outstanding += _amount;
		// Do I also need to transfer the actual tokens to the user?
		// Emit single transfer event
		emit TransferSingle(msg.sender, address(0), _to, _id, _amount);
	}

	// Mint a batch of tokens
	function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory data) public {
		// Iterate through _ids
		for (uint256 i=0; i<_ids.length; i++) {
			// Update tokenHoldership mapping
			tokenHoldership[_ids[i]][_to] += _amounts[i];
			// Increase token amount outstanding
			creatorTokens[_ids[i]].outstanding += _amounts[i];
		}
		// Do I also need to transfer the actual tokens to the user?
		// Emit batch transfer event
		emit TransferBatch(msg.sender, address(0), _to, _ids, _amounts);
	}

	// Burn a token
	function burn(address _account, uint256 _id, uint256 _value) public {
		// Update tokenHoldership mapping
		tokenHoldership[_id][_to] -= _amount;
		// Decrease token amount outstanding
		creatorTokens[_id].outstanding -= _amount;
		// Do I also need to transfer the actual tokens to from user to address(0)?
		// Emit single transfer event
		emit TransferSingle(msg.sender, _to, address(0), _id, _amount);
	}

	// Burn a batch of tokens
	function burnBatch(address account, uint256[] memory _ids, uint256[] memory _amounts) public {
		// Iterate through _ids
		for (uint256 i=0; i<_ids.length; i++) {
			// Update tokenHoldership mapping
			tokenHoldership[_ids[i]][_to] -= _amounts[i];
			// Decrease token amount outstanding
			creatorTokens[_ids[i]].outstanding -= _amounts[i];
		}
		// Do I also need to transfer the actual tokens to from user to address(0)?
		// Emit batch transfer event
		emit TransferBatch(msg.sender, _to, address(0), _ids, _amounts);
	}

	// Transfer a token
	function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) public {
		// Reduce tokenHoldership holdings of _from
		tokenHoldership[_id][_from] -= _amount;
		// Increase tokenHoldership holdings of _to
		tokenHoldership[_id][_to] += _amount;
		// Do I also need to transfer the actual tokens from _from to _to?
		// Emit single transfer event
		emit TransferSingle(msg.sender, _from, _to, _id, _amount);
	}

	// Transfer a batch of tokens
	function safeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory data) public {
		// Iterate through _ids
		for (uint256 i=0; i<_ids.length; i++) {
			// Reduce tokenHoldership holdings of _from
			tokenHoldership[_ids[i]][_from] -= _amounts[i];
			// Increase tokenHoldership holdings of _to
			tokenHoldership[_ids[i]][_to] += _amounts[i];
		}
		// Do I also need to transfer the actual tokens from _from to _to?
		// Emit batch transfer event
		emit TransferBatch(msg.sender, _from, _to, _ids, _amounts);
	}

	// Return balance of a given token at a given address
	function balanceOf(address _account, uint256 _id) external view returns (uint256) {
		// Look up _account's holdings of _id in tokenHoldership
		return tokenHoldership[_id][_account]
	}

	// Return balance of a batch of tokens
	function balanceOfBatch(address[] calldata _accounts, uint256[] calldata _ids) external view returns (uint256) {
		// Initialize output array
		uint256[] memory batchBalances = new uint256[](_accounts.length);
		// Iterate through _accounts
		for (uint256 i = 0; i < accounts.length; i++) {
			// Look up _account's holdings of _id in tokenHoldership
			batchBalances[i] = balanceOf(_accounts[i], _ids[i]);
		}
		// Return output array
		return batchBalances;
	}

	// Give operator permission to transfer caller's tokens
	function setApprovalForAll(address _operator, bool approved) external  {
		// use a mapping showing approvals
		// emit Approval event
	}

	// Denotes whether operator is approved to transfer accounts' tokens
	function isApprovedForAll(address _account, address _operator) external {
		// look up mapping showing approvals
		// emit Approval event
	}






}







