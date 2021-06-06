// figure out which version you need to use
pragma solidity ^0.4.25;

contract ERC1155 {
	// Using ERC1155 protocol in order to create/manage multiple tokens in a single smart contract

	// Transfer event
	event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
	// Approval event
	event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

	// _mint function
	function _mint(address account, uint256 amount) internal;
	// _burn function
	function _burn(address account, uint256 amount) internal;
	// _transfer function
	function _transfer(address sender, address recipient, uint256 amount) internal;

	// totalSupply function
	function totalSupply() external view returns (uint256);
	// balanceOf function
	function balanceOf(address _owner) external view returns (uint256);
	// transferFrom function
	function transferFrom(address _sender, address _receipient, uint256 amount) external payable;
	// approve function
	function approve(address _approved, uint256 amount);

}