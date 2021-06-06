// figure out which version you need to use
pragma solidity ^0.4.25;

contract ERC1155PresetMinterPauser {
	// Using ERC1155 protocol in order to create/manage multiple tokens in a single smart contract
	// Using ERC1155PresetMinterPauser preset: https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC1155/presets/ERC1155PresetMinterPauser.sol

	// Transfer event
	event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 indexed _id, uint256 value);
	// Approval event
	event ApprovalForAll(address indexed _account, address indexed _operator, bool approved);

	// Pause all token transfers
	function pause() public;
	// Unpause all token transfers
	function unpause() public;

	// Mint a token
	function mint(address _to, uint256 _id, uint256 _amount, bytes _data) internal;
	// Burn a token
	function burn(address _account, uint256 _id, uint256 _value) internal;

	// Transfer a token
	function _safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes _data) internal;

	// Return balance of a given token at a given address
	function balanceOf(address _account, uint256 id) external view returns (uint256);

	// Give operator permission to transfer caller's tokens
	function setApprovalForAll(address _operator, bool approved);
	// Denotes whether operator is approved to transfer accounts' tokens
	function isApprovedForAll(address _account, address _operator);

}