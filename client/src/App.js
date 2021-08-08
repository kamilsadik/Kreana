import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Content from "./Content";
import Inventory from "./Inventory.jsx";
import { tokens } from "./Inventory.jsx";
import OwnerDashboard from "./OwnerDashboard.jsx";
import UserHoldings from "./UserHoldings.jsx";
//import Web3 from './web3';
//import { ABI } from './ABI';

function App() {
//  const [number, setNumber] = useState(0);
//  const [getNumber, setGetNumber] = useState('0x00');
const [tokenState, setTokenState] = useState([]);

console.log(tokens);
window.tokens=tokens;
useEffect(async () => {
  setTokenState(await tokens)
}, []);

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
        <p>{tokenState.length}</p>
      </Grid>
      <Inventory>
      </Inventory>
      <UserHoldings>
      </UserHoldings>
      <OwnerDashboard>
      </OwnerDashboard>
    </Grid>
  );
};

export default App;
