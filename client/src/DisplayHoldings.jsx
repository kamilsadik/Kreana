import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { userHoldings } from "./UserHoldings.jsx";
import { tokens } from "./Inventory.jsx";

const DisplayHoldings = () => {

  const [holdingsState, setHoldingsState] = useState([]);
  console.log(userHoldings);
  useEffect(async () => {
    setHoldingsState(await userHoldings)
  }, []);

  const [tokenState, setTokenState] = useState([]);
  useEffect(async () => {
    setTokenState(await tokens)
  }, []);

  return (
    <Grid container spacing={1}>
      {holdingsState}
    </Grid>
  );
};

export default DisplayHoldings;
