import React, { Component, useState } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Content from "./Content";
import NewTokenForm from "./NewTokenForm";
import OwnerDashboard from "./OwnerDashboard.js";
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
      <Grid item container>
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={8}>
          <Content />
        </Grid>
        <Grid item xs={false} sm={2} />
      </Grid>
      <NewTokenForm>
      </NewTokenForm>
      <OwnerDashboard>
      </OwnerDashboard>
    </Grid>
  );
};

export default App;
