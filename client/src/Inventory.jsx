import React from "react";
// These imports are needed to implement Web3, and to connect the React client to the Ethereum server
import Web3 from './web3';
import { ABI } from './ABI';
import { contractAddr } from './Address';

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

// Initialize empty array of Creator Tokens
let tokens = [];

const Inventory = () => {

	async function handleCreatorTokenCount() {
		const creatorTokenCount = await ContractInstance.methods.getCreatorTokenCount().call();
		console.log(creatorTokenCount);
		return(creatorTokenCount);
	}

	async function handleCreatorTokenArray(qty) {
		for (let i=0; i<qty; i++) {
			const token = await ContractInstance.methods.creatorTokens(i).call();
			tokens.push(token);
		}
		console.log(tokens);
	}

	async function handleCreatorTokens(){
		handleCreatorTokenArray(await handleCreatorTokenCount());
		return(tokens);
	}

	handleCreatorTokens();

	return (
		null
		//handleCreatorTokens()
	);
	//return new Promise((resolve, reject) => {
	    // Where someAsyncFunction takes a callback, i.e. api call
	//    handleCreatorTokens(data => {
	//        resolve(data)
	//    })
	//})

};

export default Inventory;
export { tokens };