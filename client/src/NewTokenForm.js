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
	//let creatorTokenCount = 0;
	let creatorTokenArray = ['cats'];
	let token = 1;

	//ContractInstance.methods.getCreatorTokenCount().call().then(value => (creatorTokenCount = value));
	ContractInstance.methods.getToken(5).call().then(value => (token = value));


	async function handleCreatorToken() {
		let creatorTokenCount = await Number(ContractInstance.methods.getCreatorTokenCount().call());
		//let creatorToken0 = await ContractInstance.methods.creatorTokens(0).call();
		//for (let i = 0; i < creatorTokenCount; i++) {
		//	const item = await ContractInstance.methods.creatorTokens(i).call();
		//	console.log(`publicData[${i}] = ${item}`);
		//	creatorTokenArray.push(item);
		//}
		return (
			creatorTokenCount
		);
	}

  return (
  	<div>
 			hello
 			{handleCreatorToken()}
  		goodbye
  	</div>
  );

};

export default NewTokenForm;