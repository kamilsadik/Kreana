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

const web3 = new Web3(Web3.givenProvider);
// contract address is provided by Truffle migration
const contractAddr = '0xDB5F79f0961dF7581AB361F414602D958ED10ACE';
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

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

const ConditionalWrapper = ({ condition, wrapper, children }) => 
  condition ? wrapper(children) : children;

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

const TokenCard = props => {
  const { address, name, symbol, description, verified, outstanding, maxSupply, avatarUrl, imageUrl } = props;
    return (
        <Card>
          <CardHeader
            avatar={<Avatar src={avatarUrl} />}
            title={name}
            action={verified? <IconButton aria-label="settings"><CheckCircleIcon /></IconButton> : null}
            subheader={"$"+symbol}
          />
          <CardMedia style={{ height: "150px" }} image={imageUrl} />
          {/*
          <CardContent>
            <Typography variant="body2" component="p">
              {description}
            </Typography>
          </CardContent>
          */}
          <CardActions>
            <Button onClick={handleCreateCreatorToken}
            size="small"
            color="buy">
            BUY
            </Button>
            <Button size="small" color="sell">SELL</Button>
          </CardActions>
        </Card>
    );
};

export default TokenCard;
