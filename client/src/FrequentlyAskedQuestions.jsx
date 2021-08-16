import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


const data = {
    title: "FAQ",
    rows: [
        {
            title: "What is Kreana?",
            content: `Krena is a Ethereum-based fundraising platform and marketplace for creators and their fans. Creators mint their fundraising
            token, and fans can buy the token of their favorite creators. Creators can offer perks like 1:1 Zooms, backstage passes,
            and more to holders of their tokens. Fans benefit from guaranteed liquidity on their creator token holdings,`,
        },
        {
            title: "How does it work?",
            content: `Kreana uses a novel mechanism called a Dynamic Automated Market Maker (DAMM). The DAMM is a variation of the
            traditional bonding curve, allowing for a fixed percentage of the liquidity pool to be routed toward a fundraising goal,
            while the remainder of the pool serves to provide smooth and continuous liquidity on the underlying token. Creator tokens
            conform to the ERC-1155 token standard.`,
        },
        {
            title: "What do I need in order to get started?",
            content: `In order to create a token, or to buy and sell a creator's token, you'll need an Ethereum wallet that allows you
            to interact with Ethereum blockchain apps. We recommend <a href="https://metamask.io/index.html" target="_blank">MetaMask</a>, an easy-to-use wallet
            built into your browser. Once you've set up your wallet, you'll just need to buy some ETH in order to transact.`,
        },
        {
            title: "How do I create my own token?",
            content: `Once your <a href="https://metamask.io/index.html" target="_blank">MetaMask</a> wallet is set up, just
            click the "Create a Token" button in the menu bar to mint your fundraising token!`,
        },
        {
            title: "How do I buy or sell a token?",
            content: `Once your <a href="https://metamask.io/index.html" target="_blank">MetaMask</a> wallet is set up, just
            click buy or sell on the token you'd like to trade! Note that you can only sell tokens you own.`,
        },
        {
            title: "Where can I get help or send suggestions?",
            content: `We'd love to hear from you! You can reach us at <a href="mailto:hello@kreana.xyz">Email Us</a>.`,
        },
    ],
};

const styles = {
    bgColor: 'transparent',
    titleTextColor: "white",
    rowTitleColor: "white",
    rowContentColor: 'white',
    arrowColor: "white",
    rowContentPaddingLeft: "20px",
    rowContentPaddingBottom: "15px",
};

const darkTheme = createTheme({
  palette: {
    type: 'dark',
  },
});


const config = {
    // animate: true,
    // arrowIcon: "V",
    // tabFocus: true
};

export default function FrequentlyAskedQuestions() {

    return (
        <div>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
        </div>
    );
}
