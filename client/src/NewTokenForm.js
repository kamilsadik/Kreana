import React from "react";
import { FormControl, InputLabel, FormLabel, FormHelperText, Input } from '@material-ui/core';

const Form = () => {
  return (
	<FormControl>
	  <InputLabel htmlFor="my-input">Email address</InputLabel>
	  <Input id="my-input" aria-describedby="my-helper-text" />
	  <FormHelperText id="my-helper-text">Well never share your email.</FormHelperText>
	</FormControl>
  );
};

export default Form;