import React from "react";
import TokenCard from "./TokenCard";
import { Grid } from "@material-ui/core";
import tokenList from "./constants";

const Content = () => {

  const getTokenCard = tokenObj => {
    return (
      <Grid item xs={12} sm={4} lg={3}>
        <TokenCard {...tokenObj} />
      </Grid>
    );
  };

  return (
    <Grid container spacing={2}>
      {tokenList.map(tokenObj => getTokenCard(tokenObj))}
    </Grid>
  );
};

export default Content;
