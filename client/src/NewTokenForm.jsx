import React from "react";
import { FormControl, InputLabel, FormLabel, FormHelperText, Input } from '@material-ui/core';
// These imports are needed to implement Web3, and to connect the React client to the Ethereum server
import Web3 from './web3';
import { ABI } from './ABI';
import { contractAddr } from './Address';

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const NewTokenForm = () => {

	// Initialize empty array of Creator Tokens
	let tokens = []
	let creatorTokenCount = 70;

	async function handleCreatorTokenCount() {
		const creatorTokenCount = await ContractInstance.methods.numCreatorTokens().call();
		console.log(creatorTokenCount);
	}

	async function handleCreatorTokens() {
		for (let i=0; i<creatorTokenCount; i++) {
			const token = await ContractInstance.methods.creatorTokens(i).call();
			tokens.push(token);
		}
		console.log(tokens);
	}

	handleCreatorTokenCount();
	handleCreatorTokens();

	return (
		null
	);

};

export default NewTokenForm;