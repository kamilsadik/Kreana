# Creator Token Exchange

## Overview

Creator Token Exchange allows a creator to mint an original token to sell to their fans. The Creator Token Exchange relies on a Dynamic Automated Market Maker to generate revenue for the creator as more tokens are minted, while providing continuous and perpetual liquidity for buyers of the token.

## Background

The Dynamic Automated Market Maker (DAMM) is a novel variation of traditional bonding curve-based automated market makers, allowing for both revenue generation and liquidity provision.

### Bonding Curves

A bonding curve is a function which determines the incremental price of a token as as function of the current supply of that token. Drawing from [Yos Riady's primer](https://yos.io/2018/11/10/bonding-curves/#bonding-curves) on the subject:

> A bonding curve is a mathematical curve that defines a relationship between price and token supply.

![Bonding Curve](bonding_curve.jpeg)

By taking the area under this curve, we are able to compute the proceeds required in any given transaction. In the example below, there are tokenSupply tokens in circulation before the transaction, and a user wishes to buy 10 tokens. 

![Bonding Curve Transaction](bonding_curve_transaction.jpeg)

Bonding curves offer the advantage of guaranteed liquidity for any number of tokens at any point in time. They have the drawback of greater price slippage than liquid order book-based markets. Crucially, the entire area under the bonding curve acts as a liquidity pool (i.e., none of the area under the curve can be harvested as revenue).

### Existing Applications

#### BitClout

BitClout.com is a social media platform which allows users to create and sell their own token (called Creator Coins). The transaction flow requires users to buy the BitClout currency using bitcoin, and then to buy and sell Creator Coins for BitClout. This enables the BitClout.com organization to generate by revenue by minting BitClout, since the structure of the bonding curve prevents them from earning revenue on transactions along the bonding curve.

It is worth noting that the price of BitClout is also determined by a bonding curve-like function -- BitClout.com simply does not provide liquidity on the BitClout currency, allowing them to crystallize all proceeds from the sale of BitClout currency as profit.

The chief drawback is the use of BitClout as an intermediary currency, and the illusion of liquidity in Creator Coins. When a user wishes to sell Creator Coins at a profit, he receives BitClout in exchange. He then needs to sell his BitClout off-platform (often on Discord) at as much as a 40% discount.

![Creator Coin Bonding Curve](creator_coin_bonding_curve)
Source: [BitClout White Paper](https://bitcloutwhitepaper.com/)

BitClout relies on an intermediary currency to monetize (since all revenue acts as liquidity pool)
Depiction of BitClout bonding curve

Continuous Organizations results in wide and visible bid/offer, and the platform serving as the liquidity provider of last resort
Depiction of continuous organizations bonding curve

## Dynamic Automated Market Maker

### Motivation

Why we need a dynamic automated market maker (with sale price function that is both distinct from buy price function, and dynamic)

### Mechanism

Depiction of buy/sale price functions

### Computation

Derivation of breakpoint, demonstrating how we can construct a sale price funtion for any buy price function (s.t certain constraints)

## Use Cases

### Creator Tokens

### Alternative Uses

#### Proprietary platform (e.g., fantasy football, other platform where the platform itself would keep crystallized revenue)