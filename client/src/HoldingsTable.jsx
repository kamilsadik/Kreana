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

  function createData(token, amountHeld) {
    return { token, amountHeld };
  }

  const rows = [
    createData('Token 0', holdingsState[0]),
    createData('Token 1', holdingsState[1]),
    createData('Toknen 2', holdingsState[2]),
  ];

  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="a dense table">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Holdings</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.token}>
              <TableCell component="th" scope="row">
                {row.token}
              </TableCell>
              <TableCell align="right">{row.amountHeld}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );


}

export default HoldingsTable