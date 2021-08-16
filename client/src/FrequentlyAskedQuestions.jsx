import React, { useEffect, useState } from "react";
import Faq from "react-faq-component";
import { createTheme, ThemeProvider } from '@material-ui/core/styles';


const data = {
    title: "FAQ",
    rows: [
        {
            title: "What is Kreana?",
            content: `Krena is a fundraising platform and marketplace for creators and their fans. Creators mint their fundraising
            token, and fans can buy the token of their favorite creators. Creators can offer perks like 1:1 Zooms, backstage passes,
            and more to holders of their tokens. Fans benefit from guaranteed liquidity on their creator token holdings,`,
        },
        {
            title: "How does it work?",
            content: `Kreana uses a novel mechanism called a Dynamic Automated Market Maker (DAMM). The DAMM is a variation of the
            traditional bonding curve, allowing for a fixed percentage of the liquidity pool to be routed toward a fundraising goal,
            while the remainder of the pool serves to provide smooth and continuous liquidity on the underlying token.`,
        },
        {
            title: "What do I need in order to get started?",
            content: `Just click the "Create A Token" button in the menu bar to get started! `,
        },
        {
            title: "How do I create my own token?",
            content: `Just click the "Create A Token" button in the menu bar to get started! `,
        },
        {
            title: "What is the package version",
            content: <p>current version is 1.2.1</p>,
        },
    ],
};

const styles = {
    bgColor: 'transparent',
    titleTextColor: "white",
    rowTitleColor: "white",
    rowContentColor: 'white',
    arrowColor: "white",
    rowContentPaddingLeft: 20,
    rowContentPaddingBottom: 20,
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
