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

	// mint function
	function mint(address _to, uint256 _id, uint256 _amount, bytes _data) internal;
	// burn function
	function burn(address _account, uint256 _id, uint256 _value) internal;
	
	// transfer function
	function _safeTransferFrom(address _from, address _to, uint256 _id, uint256 _amount, bytes _data) internal;

	// totalSupply function
	function totalSupply() external view returns (uint256);
	// balanceOf function
	function balanceOf(address _owner) external view returns (uint256);
	// transferFrom function
	function transferFrom(address _sender, address _receipient, uint256 amount) external payable;
	// approve function
	function approve(address _approved, uint256 amount);

}