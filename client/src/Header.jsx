import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import AcUnitRoundedIcon from "@material-ui/icons/AcUnitRounded";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from "@material-ui/styles";
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
  typographyStyles: {
    flex: 1
  }
}));

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const Header = () => {

  // Initialze open/closed state for new Creator Token dialog
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  }
  const handleClose = () => {
    setOpen(false);
  }

  // Initialize state for new Creator Token attributes
  const [name, setName] = React.useState('');
  const [symbol, setSymbol] = React.useState('');
  const [description, setDescription] = React.useState('');

  async function handleCreateCreatorToken(e) {
    e.preventDefault();
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.createCreatorToken(
      account,
      name,
      symbol,
      description)
    .estimateGas();
    const result = await ContractInstance.methods.createCreatorToken(
      account,
      name,
      symbol,
      description)
    .send({
        from: account,
        gas: gas 
    })
    console.log(result);
    handleClose();
    setName('');
    setSymbol('');
    setDescription('');
  }

  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          kreana
        </Typography>
        <div>
          <Button variant="outlined" color="secondary" onClick={handleClickOpen}>
            Create Your Own Token
          </Button>
          <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">New Creator Token</DialogTitle>
            <DialogContent>
              <DialogContentText>
                What is your name?
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Name"
                placeholder="e.g., Protest the Hero"
                type="text"
                fullWidth
                value={name}
                onChange={(event) => {setName(event.target.value)}}
              />
              <DialogContentText>
                What do you want the symbol of your token to be?
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Symbol"
                placeholder="e.g., PTH5"
                type="text"
                fullWidth
                value={symbol}
                onChange={(event) => {setSymbol(event.target.value)}}
              />
              <DialogContentText>
                Provide a brief description of your token.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="Description"
                placeholder="e.g., This token will fund our new album."
                type="text"
                fullWidth
                value={description}
                onChange={(event) => {setDescription(event.target.value)}}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button
              onClick={(e) => handleCreateCreatorToken(e)}
              color="primary">
                Create Token
              </Button>
            </DialogActions>
          </Dialog>
        </div>
        <Button size="small">BUY $KRNA</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
