import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import { userHoldings } from "./UserHoldings.jsx";

const DisplayHoldings = () => {

  const [holdingsState, setHoldingsState] = useState([]);

  console.log(userHoldings);
  window.userHoldings=userHoldings;
  useEffect(async () => {
    setHoldingsState(await userHoldings)
  }, []);

  return (
    <Grid container spacing={2}>
      {holdingsState}
    </Grid>
  );
};

export default DisplayHoldings;
