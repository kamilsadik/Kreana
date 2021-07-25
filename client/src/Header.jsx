import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import AcUnitRoundedIcon from "@material-ui/icons/AcUnitRounded";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from "@material-ui/styles";
import Web3 from './web3';
import { ABI } from './ABI';
import { contractAddr } from './Address';

const useStyles = makeStyles(() => ({
  typographyStyles: {
    flex: 1
  }
}));

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const Header = () => {

  // Initialize state for new Creator Token attributes
  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [description, setDescription] = React.useState('');

  const handleCreateCreatorToken = async (e) => {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.createCreatorToken(
      account,
      'Protest the Hero',
      'PTH5',
      'Help fund our new album')
    .estimateGas();
    const result = await ContractInstance.methods.createCreatorToken('0x3CceA0520680098eA8e205ccD02b033E00Af3f79', 'Protest the Hero', 'PTH5', 'Help fund our new album').send({
      from: account,
      gas: gas 
    })
    console.log(result);
  }

  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          kreana
        </Typography>
        <Button onClick={handleCreateCreatorToken} size="small">Create Creator Token</Button>
        <Button size="small">BUY $KRNA</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
