import React from "react";
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
        contrastText: "#46d182",
      },
      sell: {
        light: "#f53b6a",
        main: "#f53b6a",
        dark: "#f53b6a",
        contrastText: "#f53b6a",
      }
    },
  }));

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const TokenCard = props => {
  const { address, name, symbol, description, verified, outstanding, maxSupply, tokenId, avatarUrl, imageUrl } = props;

  // Initalize open/closed state for buy dialog
  const [buyOpen, setBuyOpen] = React.useState(false);
  const handleClickBuyOpen = () => {
    setBuyOpen(true);
  };
  const handleBuyClose = () => {
    setBuyOpen(false);
  }

  // Initialze open/closed state for sell dialog
  const [sellOpen, setSellOpen] = React.useState(false);
  const handleClickSellOpen = () => {
    setSellOpen(true);
  }
  const handleSellClose = () => {
    setSellOpen(false);
  }

  // Initialize state for user-specified amount in text field
  const [amount, setAmount] = React.useState(0);

  // Invoke buyCreatorToken
  async function handleBuyCreatorToken(e, tokenId) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    //const tokenId = 0;
    const proceeds = await ContractInstance.methods._totalProceeds(tokenId, amount).call({
      from: account,
    });
    const gas = await ContractInstance.methods.buyCreatorToken(tokenId, amount).estimateGas({
      from: account,
      value: proceeds
    });
    const result = await ContractInstance.methods.buyCreatorToken(tokenId, amount).send({
      from: account,
      gas: gas,
      value: proceeds
    })
    console.log(result);
    handleBuyClose();
    setAmount(0);
  }

  // Compute proceeds required for transaction
  async function handleTotalBuyProceeds(e, tokenId) {
    e.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const result = await ContractInstance.methods._totalProceeds(tokenId, amount).call({
      from: account,
    });
    return (
      result
    );
  }

  // Invoke sellCreatorToken
  async function handleSellCreatorToken(e, tokenId) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    //const tokenId = 0;
    const gas = await ContractInstance.methods.sellCreatorToken(tokenId, amount, account).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.sellCreatorToken(tokenId, amount, account).send({
      from: account
    })
    console.log(result);
    handleSellClose();
    setAmount(0);
  }

    return (
        <Card>
          <CardHeader
            avatar={<Avatar src={avatarUrl} />}
            title={name}
            action={verified? <IconButton aria-label="settings"><CheckCircleIcon /></IconButton> : null}
            subheader={"$"+symbol}
          />
          <CardMedia style={{ height: "150px" }} image={imageUrl} />
          <CardContent>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
          </CardContent>
          <CardActions>
            <div>
              <Button variant="outlined" color="primary" onClick={handleClickBuyOpen}>
                Buy
              </Button>
              <Dialog open={buyOpen} onClose={handleBuyClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Buy Token</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    How many tokens do you wish to purchase?
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Quantity"
                    type="email"
                    fullWidth
                    value={amount}
                    onChange={(event) => {setAmount(event.target.value)}}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleBuyClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                  value={tokenId}
                  onClick={(e) => handleBuyCreatorToken(e, tokenId, amount)}
                  color="primary">
                    Complete Transaction
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
            <div>
              <Button variant="outlined" color="primary" onClick={handleClickSellOpen}>
                Sell
              </Button>
              <Dialog open={sellOpen} onClose={handleSellClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Sell Token</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    How many tokens do you wish to sell?
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="name"
                    label="Quantity"
                    type="email"
                    fullWidth
                    value={amount}
                    onChange={(event) => {setAmount(event.target.value)}}
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleSellClose} color="primary">
                    Cancel
                  </Button>
                  <Button
                  value={tokenId}
                  onClick={(e) => handleSellCreatorToken(e, tokenId, amount)}
                  color="primary">
                    Complete Transaction
                  </Button>
                </DialogActions>
              </Dialog>
            </div>
          </CardActions>
        </Card>
    );
};

export default TokenCard;
