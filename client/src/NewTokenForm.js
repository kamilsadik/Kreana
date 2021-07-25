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
	let creatorTokenArray = ['broseph'];
	let creatorTokenCount = 5;

	async function handleCreatorToken() {
		creatorTokenCount = Number(await ContractInstance.methods.getCreatorTokenCount().call());
		for (let i = 0; i < creatorTokenCount; i++) {
			const item = (await ContractInstance.methods.creatorTokens(i).call()).toString();
			console.log(`publicData[${i}] = ${item}`);
			creatorTokenArray.push(item);
		}
		return (
			creatorTokenArray
		);
	}

  return (
  	<div>
 			hello
 			{creatorTokenCount}
  		{creatorTokenArray}
  		goodbye
  	</div>
  );

};

export default NewTokenForm;