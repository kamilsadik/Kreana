import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import AcUnitRoundedIcon from "@material-ui/icons/AcUnitRounded";
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import { makeStyles } from "@material-ui/styles";

const useStyles = makeStyles(() => ({
  typographyStyles: {
    flex: 1
  }
}));

const Header = () => {
  const classes = useStyles();
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography className={classes.typographyStyles}>
          kreona
        </Typography>
        <Button size="small">BUY $KRNA</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
