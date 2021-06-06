// figure out which version you need to use
pragma solidity ^0.4.25;

import "./creatortokenhelper.sol";

contract CreatorTokenOwnership is CreatorTokenHelper, ERC20 {

	// newtransaction event

	// implement the functions (and trigger the events) included in ERC20.sol. possibilities include:
	//     balanceOf
	//     transferFrom
	//     approve

	// create a buyCreatorToken function (fnc of qty being bought)
	//     require that owner transacting with a given address owns that address
	//     increase outstanding amount of token by qty
	//     DAMM  MATH => calculate AUC (buy_price_fnc) to compute cost of qty tokens
	//     update token amount outstanding
	//     if token amount outstanding > max supply, update max supply (and call value transfer function?)
	//     emit transaction event
	//     emit relevant ERC20 event

	// create a sellCreatorToken function (fnc of qty being sold)
	//     require that owner transacting with a given address owns that address
	//     require that quantity being sold is less than token amount outstanding <= what about simultaneous sales that both get filled at too high a price before the block updates?
	//     decrease outstanding amount of token by qty
	//     DAMM  MATH => calculate AUC (sale_price_fnc) to compute proceeds earned for qty of tokens sold
	//     update token amount outstanding
	//     emit transaction event
	//     emit relevant ERC20 event

	// create a transferValue function
	//     for a given token, transfer a certain amount of ETH to the creator of that token upon a purchase
	//     transfer a certain amount to protocol owner's wallet (separate wallet from the protocol wallet)


}