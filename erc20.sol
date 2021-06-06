// figure out which version you need to use
pragma solidity ^0.4.25;

contract ERC20 {
	// Include all the events and functions you wish to use from the ERC-20 protocol:
	// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/token/ERC20/ERC20.sol

	// OpenZeppelin documentation covers how to create ERC20 supply
	// https://docs.openzeppelin.com/contracts/3.x/erc20-supply

	// Even though the platform doesn't involve users sending tokens to one another, that functionality
	// still needs to be included in the ERC20 token. Not to mention that we need some provision for
	// tranferring value to the token creator / protocol wallet.

	// Transfer
	event Transfer(address indexed _from, address indexed _to, uint256 indexed _tokenId);
	// Approval
	event Approval(address indexed _owner, address indexed _approved, uint256 indexed _tokenId);

	// mint
	function _mint(address account, uint256 amount) internal;
	// burn
	function _burn(address account, uint256 amount) internal;

	// totalSupply
	function totalSupply() external view returns (uint256);
	// balanceOf
	function balanceOf(address _owner) external view returns (uint256);
	// transfer
	function transferFrom(address _sender, address _receipient, uint256 amount) external payable;
	// approve
	function approve(address _approved, uint256 amount);

}