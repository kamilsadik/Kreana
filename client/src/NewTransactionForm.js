import React from "react";
import { FormControl, InputLabel, FormLabel, FormHelperText, Input } from '@material-ui/core';

const NewTransactionForm = () => {
  return (
	<FormControl>
	  <InputLabel htmlFor="my-input">Quantity</InputLabel>
	  <Input id="my-input" aria-describedby="my-helper-text" />
	  <FormHelperText id="my-helper-text">How many tokens do you wish to purchase?</FormHelperText>
	</FormControl>
  );
};

export default NewTransactionForm;