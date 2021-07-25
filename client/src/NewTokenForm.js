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

	async function handleCreatorTokens(e) {
	  const result = await ContractInstance.methods.creatorTokens().call();
	  console.log(result);
	  return (
	  	result
	  )
	}

  return (
  	(e) => handleCreatorTokens(e)
  );
};

export default NewTokenForm;