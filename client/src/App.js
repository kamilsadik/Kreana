import React, { Component, useState, useEffect } from "react";
import { Grid } from "@material-ui/core";
import Header from "./Header";
import Content from "./Content";
import OwnerDashboard from "./OwnerDashboard.jsx";
import DisplayHoldings from "./DisplayHoldings.jsx";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';


const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline/>
      <Grid container direction="column">

        <Grid item>
          <Header />
        </Grid>


        <br></br>
        
        <Grid item container>
          <Grid item xs={false} sm={2} />
          <Grid item xs={12} sm={8}>
            <DisplayHoldings />
          </Grid>
          <Grid item xs={false} sm={2} />
        </Grid>

        <br></br>

        <Grid item container>
          <Grid item xs={false} sm={2} />
          <Grid item xs={12} sm={8}>
            <Content />
          </Grid>
          <Grid item xs={false} sm={2} />
        </Grid>

        <OwnerDashboard>
        </OwnerDashboard>

      </Grid>
    </ThemeProvider>
  );
};

export default App;
