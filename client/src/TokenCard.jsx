import React, { Component, useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ShareIcon from "@material-ui/icons/Share";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import { Avatar, IconButton, CardMedia } from "@material-ui/core";
// These imports are needed to implement Web3, and to connect the React client to the Ethereum server
import Web3 from './web3';
import { ABI } from './ABI';
import { contractAddr } from './Address';
// These imports are needed for the Dialog
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


const useStyles = makeStyles(() => ({
    palette: {
      primary: {
        light: '#757ce8',
        main: '#3f50b5',
        dark: '#002884',
        contrastText: '#fff',
      },
      secondary: {
        light: '#ff7961',
        main: '#f44336',
        dark: '#ba000d',
        contrastText: '#000',
      },
      buy: {
        light: "#46d182",
        main: "#46d182",
        dark: "#46d182",
        contrastText: "#fff",
      },
      sell: {
        light: "#f53b6a",
        main: "#f53b6a",
        dark: "#f53b6a",
        contrastText: "#fff",
      }
    },
  }));

const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const TokenCard = props => {
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
    //avatarUrl,
    //imageUrl
  } = props;

  // Initalize open/closed state for buy dialog
  const [buyOpen, setBuyOpen] = React.useState(false);
  const handleClickBuyOpen = () => {
    setBuyOpen(true);
  };
  const handleBuyClose = () => {
    setBuyOpen(false);
    setAmount('');
  }

  // Initialze open/closed state for sell dialog
  const [sellOpen, setSellOpen] = React.useState(false);
  const handleClickSellOpen = () => {
    setSellOpen(true);
  }
  const handleSellClose = () => {
    setSellOpen(false);
    setAmount('');
  }

  // Initialize state for user-specified amount in text field
  const [amount, setAmount] = React.useState('');
  // Initialize state for transaction proceeds required
  const [transactionProceeds, setTransactionProceeds] = React.useState(0);

  const handleTransactionAmount = (amt) => {
    amt = Math.round(amt);
    if (amt == 0) {
      setAmount('');
    }
    else {
      setAmount(amt);
    }
  }

  async function getBuyProceeds(e, creatorTokenId) {
  }

  const [buyProceeds, setBuyProceeds] = React.useState(0);


  // Invoke buyCreatorToken
  async function handleBuyCreatorToken(e, creatorTokenId) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const proceeds = await ContractInstance.methods._totalProceeds(creatorTokenId, amount).call({
      from: account,
    });
    const gas = await ContractInstance.methods.buyCreatorToken(creatorTokenId, amount).estimateGas({
      from: account,
      value: proceeds
    });
    const result = await ContractInstance.methods.buyCreatorToken(creatorTokenId, amount).send({
      from: account,
      gas: gas,
      value: proceeds
    })
    console.log(result);
    handleBuyClose();
  }

  // Invoke sellCreatorToken
  async function handleSellCreatorToken(e, creatorTokenId) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.sellCreatorToken(creatorTokenId, amount, account).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.sellCreatorToken(creatorTokenId, amount, account).send({
      from: account
    })
    console.log(result);
    handleSellClose();
  }

    return (
      <ThemeProvider theme={darkTheme}>
        <Card>
          <CardHeader
            //avatar={<Avatar src={avatarUrl} />}
            title={name}
            action={verified? <IconButton aria-label="settings"><CheckCircleIcon /></IconButton> : null}
            subheader={"$"+symbol}
          />
          {/*<CardMedia style={{ height: "150px" }} image={imageUrl} />*/}
          <CardContent>
            <Typography variant="body2" component="p">
              {"Last Price: "+(lastPrice/1000000000000000000).toFixed(6)+" ETH"}<br />
              {"Tokens Outstanding: "+outstanding}<br />
              {description}
            </Typography>
          </CardContent>
          <CardActions>
            <div>
              <Button variant="outlined" color="secondary" onClick={handleClickBuyOpen}>
                Buy
              </Button>
              <Dialog open={buyOpen} onClose={handleBuyClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Buy Token</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    How many tokens do you wish to purchase?<br></br>
                    (Note: Must be a whole number of tokens)
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Quantity"
                    placeholder="100"
                    type="number"
                    fullWidth
                    value={amount}
                    onChange={(event) => {handleTransactionAmount(event.target.value)}}
                  />
                <DialogContentText>
                  Total Transaction Value: <br></br>
                  Price per Token: 
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleBuyClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                  value={creatorTokenId}
                  onClick={(e) => handleBuyCreatorToken(e, creatorTokenId)}
                  color="primary"
                  disabled={amount==''}>
                    Complete Transaction
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <Button variant="outlined" color="secondary" onClick={handleClickSellOpen}>
                Sell
              </Button>
              <Dialog open={sellOpen} onClose={handleSellClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sell Token</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    How many tokens do you wish to sell?<br></br>
                    (Note: Must be a whole number of tokens)
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Quantity"
                    placeholder="100"
                    type="number"
                    fullWidth
                    value={amount}
                    onChange={(event) => {handleTransactionAmount(event.target.value)}}
                  />
                <DialogContentText>
                  Total Transaction Value: <br></br>
                  Price per Token: 
                </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleSellClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                  value={creatorTokenId}
                  onClick={(e) => handleSellCreatorToken(e, creatorTokenId)}
                  color="primary"
                  disabled={amount==''}>
                    Complete Transaction
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </CardActions>
        </Card>
      </ThemeProvider>
    );
};

export default TokenCard;
