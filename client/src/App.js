import React, { Component, useState } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Content from "./Content";
import Form from "./NewTokenForm";
import Web3 from './web3';
import { ABI } from './ABI';

const web3 = new Web3(Web3.givenProvider);
// contract address is provided by Truffle migration
const contractAddr = '0xDB5F79f0961dF7581AB361F414602D958ED10ACE';
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

function App() {
  const [number, setNumber] = useState(0);
  const [getNumber, setGetNumber] = useState('0x00');

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
    </Grid>
  );
};

const handleCreateCreatorToken = async (e) => {
  e.preventDefault();    
  const accounts = await window.ethereum.enable();
  const account = accounts[0];
  const gas = await ContractInstance.methods.createCreatorToken('0x3CceA0520680098eA8e205ccD02b033E00Af3f79', 'Protest the Hero', 'PTH5', 'Help fund our new album')
                      .estimateGas();
  const result = await ContractInstance.methods.createCreatorToken('0x3CceA0520680098eA8e205ccD02b033E00Af3f79', 'Protest the Hero', 'PTH5', 'Help fund our new album').send({
    from: account,
    gas 
  })
  console.log(result);
}


{/*
class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {
    window.ethereum.enable();
    const web3 = new Web3(Web3.givenProvider || "http://localhost:8545")
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
  }

  constructor(props) {
    super(props)
    this.state = { account: '' }
  }

  render() {
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
    </Grid>
  );
  }
}
{*/

/*}
const Apps = () => {
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
    </Grid>
  );
};
*/}


export default App;
