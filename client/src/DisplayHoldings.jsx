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

  function mapHoldings(holdings, tokens) {
    let holdingsMap = [];
    for (let i=0; i<tokens.length; i++) {
      for (let j=0; j<holdings.length; j++) {
        holdingsMap.push({i:j});
      }
    }
    return(holdingsMap);
  }

  return (
    <Grid container spacing={1}>
      {holdingsState}
    </Grid>
  );
};

export default DisplayHoldings;