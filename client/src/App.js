import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Content from "./Content";
import OwnerDashboard from "./OwnerDashboard.jsx";
import DisplayHoldings from "./DisplayHoldings.jsx";
//import Web3 from './web3';
//import { ABI } from './ABI';

function App() {
//  const [number, setNumber] = useState(0);
//  const [getNumber, setGetNumber] = useState('0x00');


      return (
    <Grid container direction="column">
      <Grid item>
        <Header />
      </Grid>
      <DisplayHoldings>
      </DisplayHoldings>
      <Grid item container>
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={8}>
          <Content />
        </Grid>
        <Grid item xs={false} sm={2} />
      </Grid>
      <OwnerDashboard>
      </OwnerDashboard>
    </Grid>
  );
};

export default App;
