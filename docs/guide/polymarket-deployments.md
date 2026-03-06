# Polymarket Deployments

This guide covers how to deploy trading agents on **Polymarket** — a prediction market platform where agents trade YES/NO binary outcome tokens. Polymarket deployments use a fundamentally different architecture from Hyperliquid, running on Polygon with ERC4626 vaults and Safe wallets.

---

## Overview

Polymarket deployments let your agent trade on prediction markets — events with binary YES/NO outcomes like "Will BTC be above $100k on March 15?" Your agent buys and sells YES and NO tokens based on your strategy logic, and the vault manages deposits, withdrawals, and accounting on-chain.

Unlike Hyperliquid deployments that use perpetual futures on a custom L1, Polymarket deployments operate on the **Polygon** network using:

- A **Safe wallet** for secure on-chain operations
- An **ERC4626 vault** (Yearn TokenizedStrategy) for share-based deposit/withdrawal accounting
- The **Polymarket CLOB** (Central Limit Order Book) for order execution

::: info One Active Deployment
Each user can have **one active Polymarket deployment** at a time. Stop your existing deployment before creating a new one.
:::

---

## Prerequisites

Before deploying a Polymarket agent, ensure you have:

| Requirement | Details |
|-------------|---------|
| **Privy wallet delegation** | Grant delegation in the Robonet app (same as Hyperliquid) |
| **10 POL minimum** | In your Privy wallet on Polygon — covers vault contract deployment gas (~0.3 POL) plus post-deployment config calls |
| **USDC.e on Polygon** | Trading capital deposited into the vault after deployment |
| **Robonet credits** | For platform usage (purchased with USDC on Base, same as always) |

::: warning POL Gas Requirement
Safe deployment and token approvals are gasless (handled by a relayer), but the vault contract deployment itself requires POL. Make sure you have at least 10 POL in your wallet on the Polygon network (Chain ID 137).
:::

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     POLYMARKET DEPLOYMENT ARCHITECTURE                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌───────────┐ │
│   │   YOU    │ ──→ │   ROBONET    │ ──→ │   POLYGON    │ ──→ │POLYMARKET │ │
│   │  (User)  │     │   PLATFORM   │     │   NETWORK    │     │   CLOB    │ │
│   └──────────┘     └──────────────┘     └──────────────┘     └───────────┘ │
│                                                                             │
│   • Deploy agent     • Setup Safe       • ERC4626 Vault    • Order         │
│   • Deposit USDC.e   • Deploy vault     • Share accounting   matching      │
│   • Withdraw funds   • Run strategy     • On-chain settle  • YES/NO        │
│                      • Vault lifecycle    ment                tokens        │
│                                                                             │
│                     ┌──────────────┐                                        │
│                     │  SAFE WALLET │ ← Derived from Privy wallet            │
│                     │  (Polygon)   │   Holds CLOB positions & USDC.e        │
│                     └──────────────┘                                        │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Key components:**

- **Privy Wallet** — Your embedded wallet handles signing via delegated access
- **Safe Wallet** — A smart contract wallet on Polygon derived from your Privy wallet. Holds trading funds and interacts with the CLOB
- **ERC4626 Vault** — On-chain vault contract (Yearn TokenizedStrategy pattern) that manages share-based deposits and withdrawals
- **Polymarket CLOB** — The off-chain orderbook where your agent places trades. API credentials are derived when the agent starts trading (not pre-created at deployment)

---

## Deployment Setup Flow

When you create a Polymarket deployment, the platform runs through these steps automatically:

```
1. Validate user       → Check delegation, embedded wallet
2. Check POL balance   → Require ≥ 10 POL on Polygon
3. Deploy Safe         → Derive + deploy Safe wallet (gasless via relayer)
4. Set approvals       → On-chain token approvals for USDC.e + CTF
5. Deploy vault        → Deploy ERC4626 vault contract (costs ~0.3 POL)
6. Approve vault       → Authorize vault on Safe (CRITICAL for withdrawals)
7. Package config      → Store vault/Safe addresses, fee config
```

::: danger Safe-Vault Approval
Step 6 — approving the vault on the Safe — is critical. Without this approval, the vault cannot fulfill withdrawal requests. If this step fails, the deployment setup will error and must be retried.
:::

**CLOB API credentials** are not created during deployment. They are derived by the agent when it starts trading. This means the agent must successfully initialize before it can place orders on the Polymarket orderbook.

---

## Vault Mechanics

### ERC4626 / TokenizedStrategy

Polymarket vaults follow the [ERC4626](https://eips.ethereum.org/EIPS/eip-4626) tokenized vault standard, using the Yearn TokenizedStrategy pattern. Key concepts:

- **Shares** — When you deposit USDC.e, you receive vault shares proportional to the current Price Per Share (PPS)
- **PPS (Price Per Share)** — The vault's share price, updated each vault cycle via `report()`. Starts at 1.0 and changes based on strategy performance
- **Total Assets** — The total USDC.e value managed by the vault (positions + idle balance)

### Capacity & Limits

Each vault has configurable capacity limits:

| Limit | Description |
|-------|-------------|
| `total_assets_limit` | Maximum total USDC.e the vault can hold (TVL cap) |
| `max_deposit_per_wallet` | Maximum deposit per individual wallet |

The deposit UI shows a capacity indicator. When the vault is at capacity, new deposits are rejected.

### Units and Decimals

::: warning USDC.e Uses 6 Decimals
USDC.e on Polygon uses **6 decimal places**. Raw amounts in contract calls use 6-decimal integers (e.g., `1000000` = 1.00 USDC.e). Share amounts also use raw integer representation. Always verify units when interacting with the vault contract directly.
:::

---

## Deposit Flow

Depositing USDC.e into a Polymarket vault:

```
1. Connect wallet on Polygon network
2. Enter deposit amount (USDC.e)
3. previewDeposit() → Shows shares you'll receive at current PPS
4. Approve USDC.e spending (if not already approved)
5. Call deposit() on vault contract
6. Vault mints shares to your address
7. Capacity indicator updates
```

**Requirements:**
- Wallet connected to Polygon (Chain ID 137)
- Sufficient USDC.e balance
- Vault must be **active** (not deactivated) — deposits are rejected on deactivated vaults
- Deposit must not exceed `max_deposit_per_wallet` or push total assets past `total_assets_limit`

---

## Withdrawal Flow

Withdrawals work differently depending on whether the vault is **active** or **deactivated**. These are two separate paths — do not confuse them.

### Active Vault — Request & Queue

When the vault is active (agent is running), withdrawals go through a request queue:

```
1. Enter shares to withdraw
2. Call requestWithdraw(shares) on vault contract
3. Withdrawal request is QUEUED
4. Next hourly vault cycle processes the request:
   a. tend()  → Sync positions and prices
   b. report() → Finalize accounting, update PPS
   c. processWithdrawals() → Fulfill queued requests
5. USDC.e transferred to your wallet
```

::: info Processing Time
Withdrawal requests are processed during the next hourly vault cycle. In the worst case, you may wait up to ~1 hour for fulfillment. The UI shows a pending withdrawal panel while you wait.
:::

### Deactivated Vault — Direct Redeem

When the vault is deactivated (agent has been stopped), you can withdraw immediately:

```
1. Enter shares to withdraw
2. Call redeem(shares) on vault contract
3. USDC.e transferred to your wallet immediately
4. No queue, no waiting for vault cycle
```

The UI automatically detects the vault's on-chain `isActive` state and shows the appropriate withdrawal form:
- **Active vault** → Standard withdrawal request form + pending panel
- **Deactivated vault** → Direct withdrawal form with immediate redemption, deposit tab disabled

::: tip After Stopping an Agent
When you stop a Polymarket agent, the vault is deactivated. A red banner appears: "Agent Stopped — Vault Deactivated." You can withdraw your funds directly without waiting for a vault cycle.
:::

---

## Hourly Vault Lifecycle

The vault manager runs an hourly cycle in a background daemon thread alongside the trading engine:

```
┌─────────────────────────────────────────────────────────────────┐
│                    HOURLY VAULT CYCLE                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   1. tend()                                                     │
│      └─ Collect current positions from Polymarket Data API      │
│      └─ Submit position data + prices to vault contract         │
│      └─ Updates vault's view of total assets                    │
│                                                                 │
│   2. report()                                                   │
│      └─ Finalize accounting (profit/loss since last report)     │
│      └─ Update Price Per Share (PPS)                            │
│      └─ Apply performance fees if applicable                    │
│                                                                 │
│   3. processWithdrawals()                                       │
│      └─ Fulfill queued withdrawal requests                      │
│      └─ Transfer USDC.e to requestors                           │
│                                                                 │
│   Interval: Every 3600 seconds (1 hour)                         │
│   If tend() fails: entire cycle is SKIPPED (safety measure)     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

The cycle is sequential and fail-safe: if `tend()` cannot reliably collect position data, the entire cycle is skipped to avoid reporting inaccurate values to the vault contract. Steps 2 and 3 only run if step 1 succeeds.

---

## Fees

Polymarket vaults support a configurable **performance fee** set at deployment time:

| Fee | Description |
|-----|-------------|
| **Performance fee** | Percentage of profits taken as fee, configured in basis points (BPS). E.g., 500 BPS = 5% of profits. Set via `performance_fee_pct` parameter (1-20%). Applied during `report()`. |

There is no management fee or deposit/withdrawal fee at the vault level. Polymarket's CLOB charges a **2% taker fee** on trades.

---

## Constraints

| Constraint | Detail |
|------------|--------|
| One active Polymarket deployment per user | Stop existing deployment before creating a new one |
| Leverage fixed at 1.0x | No leverage available on prediction markets |
| Timeframe fixed at 1m | Strategy execution runs on 1-minute candles |
| Symbol = market slug | e.g., `btc-up-or-down-15m`, not a trading pair |
| CLOB credentials derived at runtime | Agent creates them on startup, not during deployment |
| Safe wallet persisted across deployments | Once created, your Safe address is reused |

---

## Error States & Troubleshooting

### Deployment Errors

**"Insufficient POL balance"**
- Your wallet needs ≥ 10 POL on Polygon (Chain ID 137)
- Safe deployment is gasless, but the vault contract deployment needs POL
- Bridge POL to Polygon if needed

**"Active deployment exists"**
- You already have a running Polymarket deployment
- Stop the existing one before creating a new deployment

**"Safe setup failed"**
- Privy wallet delegation may have been revoked
- Re-grant delegation in the Robonet app and retry

**"Vault deployment failed"**
- Usually a gas issue — ensure sufficient POL
- Can also indicate a Polygon network issue — retry after a few minutes

**"Vault approval on Safe failed"**
- Critical error — without this, withdrawals won't work
- Retry the deployment. If it persists, contact support

### Deposit Errors

**"Deposit rejected"**
- Vault may be deactivated (agent stopped) — deposits disabled
- Vault may be at capacity — check the capacity indicator
- Individual wallet deposit limit may be reached

### Withdrawal Errors

**"Withdrawal request failed"**
- Ensure you have vault shares to withdraw
- For active vaults, the request may fail if the vault contract has an issue
- For deactivated vaults, direct redeem should always work if you hold shares

**"Pending withdrawal not processed"**
- Withdrawal requests on active vaults are processed hourly
- If `tend()` fails (e.g., position data unavailable), the cycle is skipped
- Check back after the next hour. If it persists, the agent logs will show the vault manager errors

---

## Polymarket vs Hyperliquid Comparison

| Aspect | Hyperliquid | Polymarket |
|--------|-------------|------------|
| **Network** | Hyperliquid L1 | Polygon (Chain ID 137) |
| **Asset type** | Perpetual futures | YES/NO binary outcome tokens |
| **Vault standard** | Hyperliquid native vault | ERC4626 (Yearn TokenizedStrategy) |
| **Wallet** | Direct EOA or HL vault | Safe wallet + CLOB API credentials |
| **Deposit/Withdraw** | Via Hyperliquid API | On-chain ERC4626 on Polygon |
| **Share price** | N/A (account value) | PPS from vault contract |
| **Strategy base class** | `Strategy` | `PolymarketStrategy` (YES/NO methods) |
| **Market lifecycle** | Continuous | Rolling with resolution events |
| **Gas token** | N/A | POL (min 10 for deployment) |
| **Stats sync** | Real-time via HL API | Hourly vault cycle reads Polygon |
| **Deployment flow** | Create/delegate wallet | Safe → approvals → vault → CLOB creds at runtime |
| **Deployments per user** | Multiple (EOA: 1, Vault: unlimited) | One active |
| **Leverage** | Configurable (1-5x) | Fixed at 1.0x |
| **Currency** | USDC | USDC.e (6 decimals, Polygon) |
| **Fees** | Exchange trading fees | 2% CLOB taker fee + configurable vault performance fee |

---

## Related Documentation

- [Polymarket Strategies](/guide/polymarket-strategies) — Build strategies for prediction markets
- [Trading Venues](/guide/trading-venues) — Overview of all supported venues
- [Wallet Integration](/guide/wallet) — Wallet setup including Polygon network
- [Strategy Deployment](/guide/strategy-deployment) — General deployment guide
- [MCP Tools Reference](/guide/mcp-tools) — Tool parameters for Polymarket deployments
