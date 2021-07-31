import React from "react";
import Button from "@material-ui/core/Button";
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// These imports are needed to implement Web3, and to connect the React client to the Ethereum server
import Web3 from './web3';
import { ABI } from './ABI';
import { contractAddr } from './Address';

const web3 = new Web3(Web3.givenProvider);
// Contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const OwnerDashboard = props => {

  const { address, name, symbol, description, verified, outstanding, maxSupply, tokenId, avatarUrl, imageUrl } = props;

  // Initalize open/closed state for verification dialog
  const [verificationOpen, setVerificationOpen] = React.useState(false);
  const handleClickVerificationOpen = () => {
    setVerificationOpen(true);
  };
  const handleVerificationClose = () => {
    setVerificationOpen(false);
  }

  async function handleWithdraw(e) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.withdraw(account).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.withdraw(account).send({
      from: account
    })
    console.log(result);
  }

  async function handlePayoutPlatformFees(e) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.payoutPlatformFees(account).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.payoutPlatformFees(account).send({
      from: account
    })
    console.log(result);
  }

  async function handleChangePlatformFee(e, newFee) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.changePlatformFee(newFee).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.changePlatformFee(newFee).send({
      from: account
    })
    console.log(result);
  }

  async function handleChangeProfitMargin(e, newProfitMargin) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.changeProfitMargin(newProfitMargin).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.changeProfitMargin(newProfitMargin).send({
      from: account
    })
    console.log(result);
  }

  // For simplicity, right now calling this automatically sets verification status to true
  async function handleChangeVerification(e, tokenId) {
    e.preventDefault();    
    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    const gas = await ContractInstance.methods.changeVerification(tokenId, true).estimateGas({
      from: account,
    });
    const result = await ContractInstance.methods.changeVerification(tokenId, true).send({
      from: account
    })
    console.log(result);
  }

	return (
		<div>
		<Button variant="outlined" color="primary" onClick={handleClickVerificationOpen}>
		  Verify a Token
		</Button>
		<Dialog
		open={verificationOpen}
		onClose={handleVerificationClose}
		aria-labelledby="form-dialog-title">
		  <DialogTitle id="form-dialog-title">
		  Verify Token
		  </DialogTitle>
		  <DialogContent>
		    <DialogContentText>
		      Which token do you wish to verify?
		    </DialogContentText>
		    <TextField
		      autoFocus
		      margin="dense"
		      id="name"
		      label="Token"
		      placeholder="0"
		      type="number"
		      fullWidth
		    />
		  </DialogContent>
		  <DialogActions>
		    <Button
		    onClick={handleVerificationClose}
		    color="primary">
		      Cancel
		    </Button>
		    <Button
		    value={tokenId}
		    onClick={(e) => handleChangeVerification(e, tokenId)}
		    color="primary">
		      Verify
		    </Button>
		  </DialogActions>
		</Dialog>
		</div>
	);
}

export default OwnerDashboard;