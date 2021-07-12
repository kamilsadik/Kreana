# Creator Token Exchange

## Overview

Creator Token Exchange allows a creator to mint an original token to sell to their fans. The Creator Token Exchange relies on a Dynamic Automated Market Maker to generate revenue for the creator as more tokens are minted, while providing continuous and perpetual liquidity for buyers of the token.

## Dynamic Automated Market Maker

### Background

The Dynamic Automated Market Maker (DAMM) is a novel variation of traditional bonding curve-based automated market makers, allowing for both revenue generation and liquidity provision.

#### Bonding Curves


A bonding curve is a function which determines the incremental price of a token as as function of the current supply of that token. Drawing from [Yos Riady's primer](https://yos.io/2018/11/10/bonding-curves/#bonding-curves) on the subject:

> A bonding curve is a mathematical curve that defines a relationship between price and token supply.

![Bonding Curve](bonding_curve.jpeg)

By taking the area under this curve, we are able to compute the proceeds required in any given transaction. In the example below, there are tokenSupply tokens in circulation before the transaction, and a user wishes to buy 10 tokens. 

![Bonding Curve Transaction](bonding_curve_transaction.jpeg)

#### Existing Applications

BitClout relies on an intermediary currency to monetize (since all revenue acts as liquidity pool)
Depiction of BitClout bonding curve

Continuous Organizations results in wide and visible bid/offer, and the platform serving as the liquidity provider of last resort
Depiction of continuous organizations bonding curve

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