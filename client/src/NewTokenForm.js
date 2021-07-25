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

	// Initialize state for array of Creator Tokens
	const creatorTokenArray = [];

	const creatorTokenCount = ContractInstance.methods.getCreatorTokenCount();
	for (let i = 0; i < creatorTokenCount; i++) {
		const item = ContractInstance.methods.creatorTokens(i);
		console.log(`publicData[${i}] = ${item}`);
		creatorTokenArray.push(item);
	}

  return (
  	<div>
  	  {creatorTokenArray.map(item => (<p>{item.name}</p>))}
  	</div>
  );
  //(
  //	'hello',
  //	arr,
  //	'goodbye'
  //  (e) => handleCreatorTokens(e)
  //);
};

export default NewTokenForm;