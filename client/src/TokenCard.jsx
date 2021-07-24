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

const web3 = new Web3(Web3.givenProvider);
// contract address is provided by Truffle migration
const ContractInstance = new web3.eth.Contract(ABI, contractAddr);

const handleBuyCreatorToken = async (e) => {
  e.preventDefault();    
  const accounts = await window.ethereum.enable();
  const account = accounts[0];
  const tokenId = 0;
  const proceeds = await ContractInstance.methods._totalProceeds(tokenId, 5000).call({
    from: account,
  });
  const gas = await ContractInstance.methods.buyCreatorToken(tokenId, 5000).estimateGas({
    from: account,
    value: proceeds
  });
  const result = await ContractInstance.methods.buyCreatorToken(tokenId, 5000).send({
    from: account,
    gas: gas,
    value: proceeds
  })
  console.log(result);
}

const handleSellCreatorToken = async (e) => {
  e.preventDefault();    
  const accounts = await window.ethereum.enable();
  const account = accounts[0];
  const tokenId = 0;
  const gas = await ContractInstance.methods.sellCreatorToken(tokenId, 5000, account).estimateGas({
    from: account,
  });
  const result = await ContractInstance.methods.sellCreatorToken(tokenId, 5000, account).send({
    from: account
  })
  console.log(result);
}

const TokenCard = props => {
  const { address, name, symbol, description, verified, outstanding, maxSupply, tokenId, avatarUrl, imageUrl } = props;
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
            <Button
            value={tokenId}
            onClick={(e) => handleBuyCreatorToken(e, tokenId)}
            size="small"
            color="buy">
            BUY
            </Button>
            <Button
            value={tokenId}
            onClick={handleSellCreatorToken}
            size="small"
            color="sell">
            SELL
            </Button>
          </CardActions>
        </Card>
    );
};

export default TokenCard;
