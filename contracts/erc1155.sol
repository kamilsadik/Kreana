// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ERC1155PresetMinterPauser {
	// Using ERC1155 protocol in order to create/manage multiple tokens in a single smart contract
	// Using ERC1155PresetMinterPauser preset: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol

	// Single transfer event
	event TransferSingle(address operator, address indexed from, address indexed to, uint256 indexed id, uint256 value);
	// Batch transfer event
	event TransferBatch(address operator, address indexed from, address indexed to, uint256[] ids, uint256[] values);
	// Approval event
	event ApprovalForAll(address indexed account, address indexed operator, bool approved);
	// Pause event
	event Paused(address account);
	// Unpause event
	event Unpaused(address account);

	// Pause all token transfers
	function pause() public;
	// Unpause all token transfers
	function unpause() public;

	// Mint a token
	function mint(address _to, uint256 _id, uint256 _amount, bytes memory _data) public;
	// Mint a batch of tokens
	function mintBatch(address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory data) public;
	// Burn a token
	function burn(address _account, uint256 _id, uint256 _value) public;
	// Burn a batch of tokens
	function burnBatch(address account, uint256[] memory _ids, uint256[] memory _amounts) public;

	// Transfer a token
	function safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes memory _data) public;
	// Transfer a batchof tokens
	function safeBatchTransferFrom(address _from, address _to, uint256[] memory _ids, uint256[] memory _amounts, bytes memory data) public;

	// Return balance of a given token at a given address
	function balanceOf(address _account, uint256 _id) external view returns (uint256);
	// Return balance of a batch of tokens
	function balanceOfBatch(address[] calldata _accounts, uint256[] calldata _ids) external view returns (uint256);

	// Give operator permission to transfer caller's tokens
	function setApprovalForAll(address _operator, bool approved) external;
	// Denotes whether operator is approved to transfer accounts' tokens
	function isApprovedForAll(address _account, address _operator) external;
	
}