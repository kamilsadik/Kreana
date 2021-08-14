import React, { Component, useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
//import DisplayHoldings from "./DisplayHoldings.jsx";
import { userHoldings } from "./UserHoldings.jsx";
import { tokens } from "./Inventory.jsx";

const useStyles = makeStyles({
  table: {
    minWidth: 350,
  },
});

const HoldingsTable = props => {
  const {
    address,
    name,
    symbol,
    description,
    verified,
    outstanding,
    maxSupply,
    lastPrice,
    creatorTokenId,
  } = props;

  const classes = useStyles();

  const [holdingsState, setHoldingsState] = useState([]);
  console.log(userHoldings);
  useEffect(() => {
    async function fetchData() {
      setHoldingsState(await userHoldings);
    }
    fetchData();
  }, []);

  const [tokenState, setTokenState] = useState([]);
  useEffect(() => {
    async function fetchData() {
      setTokenState(await tokens);
    }
    fetchData();
  }, []);

  function createData(token, amountHeld, value) {
    return { token, amountHeld, value };
  }

  const rows = [
    createData(
      tokenState.map(tokenObj => tokenObj.symbol)[0],
      holdingsState[0],
      (holdingsState[0]*tokenState.map(tokenObj => tokenObj.lastPrice)[0]/1000000000000000000).toFixed(6)),
    createData(
      tokenState.map(tokenObj => tokenObj.symbol)[1],
      holdingsState[1],
      (holdingsState[1]*tokenState.map(tokenObj => tokenObj.lastPrice)[1]/1000000000000000000).toFixed(6)),
    createData(
      tokenState.map(tokenObj => tokenObj.symbol)[2],
      holdingsState[2],
      (holdingsState[2]*tokenState.map(tokenObj => tokenObj.lastPrice)[2]/1000000000000000000).toFixed(6)),
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Holdings</TableCell>
            <TableCell align="right">Value (ETH)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.token}>
              <TableCell component="th" scope="row">
                {row.token}
              </TableCell>
              <TableCell align="right">{row.amountHeld}</TableCell>
              <TableCell align="right">{row.value}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


}

export default HoldingsTable