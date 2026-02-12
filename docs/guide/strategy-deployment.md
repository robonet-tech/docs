# Strategy Deployment & Trade Execution

This document explains how Robonet strategies are deployed and how agents execute trades on your behalf.

---

## Table of Contents

1. [Overview](#overview)
2. [Deployment Types](#deployment-types)
3. [How to Deploy a Strategy](#how-to-deploy-a-strategy)
4. [What Happens Under the Hood](#what-happens-under-the-hood)
5. [How Agents Execute Trades](#how-agents-execute-trades)
6. [Security & Trust Model](#security--trust-model)
7. [Glossary](#glossary)

---

## Overview

Robonet lets you deploy automated trading strategies that run around the clock on supported exchanges. When you deploy a strategy, we package it into a secure container and run it on our private hosting infrastructure. Your agent then connects to the exchange, monitors markets, and executes trades based on the strategy's logic.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           ROBONET ARCHITECTURE                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐      ┌──────────────┐      ┌──────────────┐      ┌────────┐  │
│   │   YOU    │ ──── │   ROBONET    │ ──── │   HOSTING    │ ──── │EXCHANGE│  │
│   │  (User)  │      │   PLATFORM   │      │   PLATFORM   │      │  (HL)  │  │
│   └──────────┘      └──────────────┘      └──────────────┘      └────────┘  │
│                                                                             │
│   • Select strategy    • Package strategy   • Run container    • Execute    │
│   • Configure params   • Create workload    • Monitor health     trades     │
│   • Delegate wallet    • Track status       • Stream logs      • Settlement │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

Strategies can execute on **Hyperliquid Perpetuals** (perpetual futures DEX) or **Polymarket** (prediction markets). This page covers the Hyperliquid deployment flow. For Polymarket deployments, see the [Polymarket Strategies guide](/guide/polymarket#deploying-a-polymarket-strategy).

---

## Understanding Your Balances

Before diving into deployments, it's helpful to understand that Robonet works with two separate balances, each on a different chain and serving a different purpose.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          YOUR BALANCES                                      │
├───────────────────────────────────┬─────────────────────────────────────────┤
│         HYPERCORE (USDC)          │             BASE (USDC)                 │
├───────────────────────────────────┼─────────────────────────────────────────┤
│                                   │                                         │
│   ┌─────────────────────┐         │      ┌─────────────────────┐            │
│   │   TRADING BALANCE   │         │      │   CREDIT BALANCE    │            │
│   │                     │         │      │                     │            │
│   │  • Fund strategies  │         │      │  • Pay for credits  │            │
│   │  • Collateral for   │         │      │  • Platform usage   │            │
│   │    open positions   │         │      │                     │            │
│   │  • PnL settles here │         │      │                     │            │
│   └─────────────────────┘         │      └─────────────────────┘            │
│                                   │                                         │
│   Used by your agents to          │   Used to fund your Robonet            │
│   trade on Hyperliquid            │   credits on the Base network           │
│                                   │                                         │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

### HyperCore Balance

Your HyperCore balance is USDC held on Hyperliquid's trading layer. This is the balance your agents use when executing trades — it serves as collateral for open positions and is where your PnL settles. Whether you're trading via an EOA or a vault, the funds powering your strategies live here.

### Base Balance

Your Base balance is USDC on the Base network, and it's used for a different purpose entirely: funding your Robonet credits. Credits are what you use to pay for platform access and strategy deployments. Think of it as your operating account — separate from the capital your agents are actively trading with.

### Why Two Balances?

Keeping these balances separate means your trading capital and your platform credits never mix. You won't accidentally eat into your trading collateral to pay for credits, and vice versa. Each balance lives on the chain best suited to its purpose: HyperCore for high-performance trading, Base for efficient credit transactions.

---

## Deployment Types

When deploying a strategy, you'll choose between two models: trading directly from your wallet (EOA) or through a dedicated vault. Each approach has its own trade-offs depending on how you want to manage funds and risk.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPLOYMENT TYPES                                   │
├───────────────────────────────────┬─────────────────────────────────────────┤
│           EOA (WALLET)            │              VAULT                      │
├───────────────────────────────────┼─────────────────────────────────────────┤
│                                   │                                         │
│   ┌─────────────────────┐         │      ┌─────────────────────┐            │
│   │    YOUR WALLET      │         │      │   HYPERLIQUID VAULT │            │
│   │  ┌───────────────┐  │         │      │  ┌───────────────┐  │            │
│   │  │  USDC Balance │  │         │      │  │  Pooled USDC  │  │            │
│   │  │      ↓        │  │         │      │  │      ↓        │  │            │
│   │  │    Agent      │  │         │      │  │    Agent      │  │            │
│   │  │   Trades      │  │         │      │  │   Trades      │  │            │
│   │  └───────────────┘  │         │      │  └───────────────┘  │            │
│   └─────────────────────┘         │      └─────────────────────┘            │
│                                   │                                         │
│   • Direct wallet trading         │   • Separate vault contract             │
│   • 1 active deployment/wallet    │   • Unlimited vaults per user           │
│   • Your existing HL balance      │   • 200 USDC minimum deposit            │
│   • Full control over funds       │   • Isolated from wallet funds          │
│                                   │                                         │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

### EOA (Externally Owned Account)

With an EOA deployment, your agent trades directly from your connected wallet on Hyperliquid. This is the simplest option — if you already have USDC on Hyperliquid, you can deploy immediately. The trade-off is that you can only run one active strategy per wallet, since all trades share the same balance.

| Aspect | Details |
|--------|---------|
| **Limit** | 1 active deployment per wallet |
| **Funds** | Uses your existing Hyperliquid balance |
| **Minimum** | USDC deposited on Hyperliquid |
| **Best For** | Users who want direct wallet control |

### Hyperliquid Vault

Hyperliquid Vault deployments create a separate vault for each strategy. This isolates your trading capital — if one strategy performs poorly, it doesn't affect funds in other vaults or your main wallet. You can run as many vault strategies as you like, each with its own dedicated capital.

Vaults also enable **capital formation**: other users can deposit funds into your vault, allowing you to manage external capital alongside your own. This makes vaults ideal for strategy creators who want to build a track record and attract investors.

**Managing vault funds:** Deposits and withdrawals are handled directly through the Hyperliquid interface — Robonet doesn't custody or control fund movements. Note that each vault is tied to a single strategy; if you want to run a different strategy, you'll need to create a new vault.

| Aspect | Details |
|--------|---------|
| **Limit** | Unlimited vaults per user |
| **Funds** | Isolated in vault contract |
| **Minimum** | 200 USDC |
| **Capital Formation** | Other users can deposit into your vault |
| **Best For** | Multiple strategies, risk isolation, attracting investors |

---

## How to Deploy a Strategy

### Prerequisites

Before you can deploy, make sure you've completed these steps:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DEPLOYMENT CHECKLIST                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ☐ 1. CONNECTED WALLET                                                     │
│      └── Sign in with your wallet via Privy                                 │
│                                                                             │
│   ☐ 2. WALLET DELEGATION                                                    │
│      └── One-time authorization for Robonet to sign trades                  │
│      └── This enables server-side order execution                           │
│                                                                             │
│   ☐ 3. FUNDED ACCOUNT                                                       │
│      ├── EOA: USDC on Hyperliquid (your wallet)                             │
│      └── Hyperliquid Vault: 200+ USDC on Hyperliquid (for vault creation)   │
│                                                                             │
│   ☐ 4. SELECTED STRATEGY                                                    │
│      └── Browse strategies in the Strategies tab                            │
│      └── Review backtest performance before deploying                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

The wallet delegation step is important: it's a one-time authorization that allows Robonet to sign trades on your behalf. Without it, your agent wouldn't be able to execute orders. You can revoke this delegation at any time.

### Deployment Steps

Once you're ready, deploying a strategy takes just a few clicks:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEPLOYMENT FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   STEP 1                    STEP 2                    STEP 3                │
│   ┌─────────────┐           ┌─────────────┐           ┌─────────────┐       │
│   │  STRATEGIES │           │   DEPLOY    │           │  CONFIGURE  │       │
│   │     TAB     │    ───►   │   BUTTON    │    ───►   │    MODAL    │       │
│   │             │           │             │           │             │       │
│   │ • Browse    │           │ Click ⋮     │           │ • Type      │       │
│   │ • Backtest  │           │ → Deploy    │           │ • Pair      │       │
│   │ • Compare   │           │             │           │ • Leverage  │       │
│   └─────────────┘           └─────────────┘           └─────────────┘       │
│                                                              │              │
│                                                              ▼              │
│   STEP 6                    STEP 5                    STEP 4                │
│   ┌─────────────┐           ┌─────────────┐           ┌─────────────┐       │
│   │   RUNNING   │           │   MONITOR   │           │   SUBMIT    │       │
│   │     ✓       │    ◄───   │   STATUS    │    ◄───   │             │       │
│   │             │           │             │           │             │       │
│   │ • Trading   │           │ • Pending   │           │ Click       │       │
│   │ • Live PnL  │           │ • Building  │           │ "Deploy"    │       │
│   │ • Metrics   │           │ • Starting  │           │             │       │
│   └─────────────┘           └─────────────┘           └─────────────┘       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

Start by browsing the Strategies tab to find one that fits your goals. You can review backtested performance metrics like return, Sharpe ratio, and max drawdown before committing. When you're ready, click the three-dot menu on a strategy and select "Deploy."

In the configuration modal, you'll choose your deployment type (EOA or Hyperliquid Vault), select a trading pair, set your timeframe, and pick a leverage level. Once you submit, the system takes over and handles the rest.

#### Configuration Options

| Parameter | Description | Options |
|-----------|-------------|---------|
| **Deployment Type** | How funds are managed | EOA (Wallet) / Hyperliquid Vault |
| **Vault Name** | Name for your Hyperliquid Vault (vault deployments only) | 3-50 characters |
| **Trading Pair** | Asset to trade | BTC-USDC, ETH-USDC, etc. |
| **Timeframe** | Candle interval for strategy evaluation | 1m, 5m, 15m, 1h, 4h, 1d |
| **Leverage** | Position size multiplier | 1x - 5x |

### Deploying via MCP Tools

If you're using the MCP server integration, you can deploy strategies directly via AI commands:

```
Deploy MomentumRSI_M to BTC-USDT on 4h timeframe with 2x leverage
```

**Available MCP deployment tools:**

| Tool | Purpose |
|------|---------|
| `deployment_create` | Launch a new deployment with strategy, symbol, timeframe, and leverage |
| `deployment_list` | View all your deployments with status and performance metrics |
| `deployment_start` | Restart a stopped deployment |
| `deployment_stop` | Stop a running deployment |

These tools require wallet delegation to be set up first. EOA deployments are limited to one active deployment per wallet; vault deployments have no limit.

See [MCP Tools Reference](/guide/mcp-tools#deployment-tools) for full documentation and parameter details.

---

## What Happens Under the Hood

When you click "Deploy," a series of steps kicks off behind the scenes. The whole process typically takes a minute or two, and you can watch the status change in real-time.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     DEPLOYMENT PIPELINE                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │   DEPLOY    │                                                            │
│  │   CLICKED   │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  1. VAULT CREATION (if vault deployment)                │                │
│  │     • Sign EIP-712 typed data via delegated wallet      │                │
│  │     • Create vault on Hyperliquid                       │                │
│  │     • Transfer initial USDC to vault                    │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  2. STRATEGY PACKAGING                                  │                │
│  │     • Fetch strategy code                               │                │
│  │     • Bundle with configuration (pair, leverage, etc.)  │                │
│  │     • Create deployment artifact                        │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  3. WORKLOAD SUBMISSION                                 │  ◄── PENDING   │
│  │     • Send artifact to hosting platform                 │                │
│  │     • Authenticate via secure JWT                       │                │
│  │     • Create workload record                            │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  4. SECURITY SCAN                                       │  ◄── BUILDING  │
│  │     • Scan artifact for vulnerabilities                 │                │
│  │     • Validate code integrity                           │                │
│  │     • Block if security issues found                    │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  5. CONTAINER BUILD                                     │  ◄── BUILDING  │
│  │     • Build Docker image with strategy                  │                │
│  │     • Push to private container registry                │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  6. DEPLOYMENT TO CLUSTER                               │  ◄── STARTING  │
│  │     • Create isolated environment (namespace)           │                │
│  │     • Deploy container with resource limits             │                │
│  │     • Start trading agent                               │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │   RUNNING   │  Agent is now live and trading                             │
│  │      ✓      │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

If you chose a vault deployment, the first step creates a new vault on Hyperliquid using a cryptographically signed message from your delegated wallet. This vault becomes the dedicated home for that strategy's funds.

Next, the platform packages your strategy code together with your configuration settings into a deployment artifact. This bundle contains everything the agent needs to run: the strategy logic, your chosen trading pair, timeframe, and leverage settings.

The artifact is then submitted to our hosting platform, where it goes through a mandatory security scan. We check for vulnerabilities, malicious code, and integrity issues before anything runs. If the scan passes, we build a container image and deploy it to an isolated environment with strict resource limits.

Once the container starts up and connects to the exchange, your deployment status changes to "running" and your agent begins trading.

### Deployment Statuses

As your deployment progresses, you'll see these status updates:

| Status | What's Happening |
|--------|------------------|
| `pending` | Deployment created and queued for processing |
| `building` | Security scan running and container image being built |
| `starting` | Container deployed, agent connecting to exchange |
| `running` | Agent is live and actively trading |
| `stopping` | Graceful shutdown in progress |
| `stopped` | Agent stopped (can be restarted anytime) |
| `failed` | Something went wrong (check status message for details) |

---

## How Agents Execute Trades

Once your agent is running, it operates continuously — monitoring market data, evaluating your strategy, and executing trades when conditions are met. Let's break down exactly how this works.

### Execution Architecture

Your agent runs on our hosting infrastructure and maintains a persistent connection to Hyperliquid. It uses REST APIs for submitting orders and WebSocket streams for receiving real-time updates on fills and market data.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        TRADE EXECUTION FLOW                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   HOSTING PLATFORM                              HYPERLIQUID EXCHANGE        │
│   ┌─────────────────────────────────────┐      ┌─────────────────────────┐  │
│   │                                     │      │                         │  │
│   │  ┌─────────────────────────────┐    │      │   ┌─────────────────┐   │  │
│   │  │      TRADING AGENT          │    │      │   │   ORDER BOOK    │   │  │
│   │  │  ┌───────────────────────┐  │    │      │   │                 │   │  │
│   │  │  │   STRATEGY ENGINE     │  │    │      │   │  Bids │ Asks    │   │  │
│   │  │  │                       │  │    │      │   │   ────┼────     │   │  │
│   │  │  │  • Analyze candles    │  │    │      │   │       │         │   │  │
│   │  │  │  • Generate signals   │  │    │      │   └─────────────────┘   │  │
│   │  │  │  • Risk management    │  │    │      │                         │  │
│   │  │  └───────────┬───────────┘  │    │      │   ┌─────────────────┐   │  │
│   │  │              │              │    │      │   │    MATCHING     │   │  │
│   │  │              ▼              │    │      │   │     ENGINE      │   │  │
│   │  │  ┌───────────────────────┐  │◄───┼──────┼──►│                 │   │  │
│   │  │  │   EXCHANGE CLIENT     │  │WebSocket  │   │  • Fill orders  │   │  │
│   │  │  │                       │  │    │      │   │  • Update PnL   │   │  │
│   │  │  │  • Sign orders        │──┼────┼──────┼──►│  • Liquidations │   │  │
│   │  │  │  • Submit to exchange │REST API      │   │                 │   │  │
│   │  │  │  • Track fills        │  │    │      │   └─────────────────┘   │  │
│   │  │  └───────────────────────┘  │    │      │                         │  │
│   │  │                             │    │      │                         │  │
│   │  └─────────────────────────────┘    │      │                         │  │
│   │                                     │      │                         │  │
│   └─────────────────────────────────────┘      └─────────────────────────┘  │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Where Trades Execute

All trades settle on Hyperliquid, a perpetual futures DEX built on its own L1 blockchain. Your funds never leave the exchange — Robonet only has the authority to trade, not to withdraw.

| Aspect | Details |
|--------|---------|
| **Exchange** | Hyperliquid Perpetuals |
| **Settlement** | On-chain (Hyperliquid L1) |
| **Collateral** | USDC |
| **Order Types** | Market, Limit, Stop-Loss, Take-Profit |

### When Trades Happen

The trading engine uses a **scheduled execution model** rather than purely event-driven triggers. This ensures consistent, predictable behavior regardless of network conditions.

Here's how the timing works: the system continuously refreshes market data every minute, fetching the latest 1-minute candles. A few seconds later, the scheduler checks whether it's time to evaluate your strategy based on its configured timeframe.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      EXECUTION TIMING MODEL                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   CONTINUOUS DATA REFRESH (Every Minute)                                    │
│   ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│   TIME:    :00:01   :01:01   :02:01   :03:01   :04:01   :05:01   ...        │
│              │        │        │        │        │        │                 │
│              ▼        ▼        ▼        ▼        ▼        ▼                 │
│            ┌────┐   ┌────┐   ┌────┐   ┌────┐   ┌────┐   ┌────┐              │
│            │ 1m │   │ 1m │   │ 1m │   │ 1m │   │ 1m │   │ 1m │  ◄── Fetch   │
│            └────┘   └────┘   └────┘   └────┘   └────┘   └────┘      1m data │
│                                                                             │
│   STRATEGY SCHEDULER (Every Minute at :05 seconds)                          │
│   ════════════════════════════════════════════════════════════════════════  │
│                                                                             │
│   TIME:    :00:05   :01:05   :02:05   :03:05   :04:05   :05:05   ...        │
│              │        │        │        │        │        │                 │
│              ▼        ▼        ▼        ▼        ▼        ▼                 │
│            Check    Check    Check    Check    Check    Check               │
│           boundary boundary boundary boundary boundary boundary             │
│                                                                             │
│   EXAMPLE: 1h STRATEGY                                                      │
│   ───────────────────────────────────────────────────────────────────────── │
│                                                                             │
│   00:00:05  01:00:05  02:00:05  03:00:05  04:00:05  ...                     │
│      │         │         │         │         │                              │
│      ▼         ▼         ▼         ▼         ▼                              │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐                          │
│   │EXECUTE│ │EXECUTE│ │EXECUTE│ │EXECUTE│ │EXECUTE│  ◄── Hourly boundaries  │
│   └──────┘  └──────┘  └──────┘  └──────┘  └──────┘      only                │
│      │                    │                                                 │
│      ▼                    ▼                                                 │
│   ┌──────┐             ┌──────┐                                             │
│   │ HOLD │             │ BUY  │  ◄── Signal generated                       │
│   └──────┘             └──────┘                                             │
│                           │                                                 │
│                           ▼                                                 │
│                     ┌───────────┐                                           │
│                     │  ORDER    │  ◄── Order submitted immediately          │
│                     │ EXECUTED  │                                           │
│                     └───────────┘                                           │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

For example, if you deploy a 1-hour strategy, the scheduler checks every minute but only executes the strategy at the top of each hour (00:00, 01:00, 02:00, etc.). A 5-minute strategy would execute at :00, :05, :10, :15, and so on.

When execution happens, the strategy analyzes the latest candle data, generates a signal (buy, sell, or hold), and if action is needed, submits the order immediately.

**Execution Frequency by Timeframe:**

| Timeframe | Executes At | Frequency |
|-----------|-------------|-----------|
| **1m** | Every minute (`:00:05`, `:01:05`, `:02:05`...) | 1,440x/day |
| **5m** | Every 5 min (`:00:05`, `:05:05`, `:10:05`...) | 288x/day |
| **15m** | Every 15 min (`:00:05`, `:15:05`, `:30:05`...) | 96x/day |
| **1h** | Every hour (`00:00:05`, `01:00:05`...) | 24x/day |
| **4h** | Every 4 hours (`00:00:05`, `04:00:05`...) | 6x/day |
| **1d** | Once daily (`00:00:05` UTC) | 1x/day |

### How Orders Are Signed

Every order needs to be cryptographically signed before Hyperliquid will accept it. This is where wallet delegation comes in — it allows Robonet to sign orders on your behalf without ever exposing your private keys.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        ORDER SIGNING FLOW                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────────┐      ┌──────────────┐      ┌──────────────┐              │
│   │   STRATEGY   │      │    PRIVY     │      │  HYPERLIQUID │              │
│   │   SIGNAL     │ ───► │   WALLET     │ ───► │   EXCHANGE   │              │
│   │              │      │   SERVICE    │      │              │              │
│   │  "Buy 0.1    │      │              │      │  Validates   │              │
│   │   BTC-USDC"  │      │  Signs order │      │  signature   │              │
│   │              │      │  server-side │      │  & executes  │              │
│   └──────────────┘      └──────────────┘      └──────────────┘              │
│                                                                             │
│   Your wallet delegation allows Robonet to sign orders on your behalf       │
│   without exposing your private keys. Keys are managed by Privy's           │
│   secure infrastructure.                                                    │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

When your strategy generates a trade signal, the order details are sent to Privy's wallet service, which holds your delegated signing authority. Privy signs the order server-side using MPC (multi-party computation), meaning no single server ever has access to your complete private key. The signed order is then submitted to Hyperliquid, which validates the signature and executes the trade.

### Order Types Supported

Your strategy can use several order types depending on its logic:

| Type | Use Case | How It Works |
|------|----------|--------------|
| **Market** | Immediate entry/exit | Fills at the best available price right away |
| **Limit** | Precise price targets | Rests on the order book until the price is reached |
| **Stop-Loss** | Risk management | Triggers a market sell if price drops to your stop level |
| **Take-Profit** | Locking in gains | Triggers a market sell when price hits your target |

---

## Security & Trust Model

Security is built into every layer of the system. Here's how we protect your funds and ensure your strategies run safely.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        SECURITY LAYERS                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   LAYER 1: WALLET SECURITY                                                  │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Privy embedded wallets (MPC-secured)                             │   │
│   │  • Server-side signing (keys never exposed)                         │   │
│   │  • Delegation revocable at any time                                 │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   LAYER 2: ARTIFACT SECURITY                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Mandatory security scanning before deployment                    │   │
│   │  • Vulnerability detection and blocking                             │   │
│   │  • Code integrity validation                                        │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   LAYER 3: EXECUTION ISOLATION                                              │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • Per-user isolated environments                                   │   │
│   │  • Resource limits (CPU, memory)                                    │   │
│   │  • Network policies (restricted access)                             │   │
│   │  • Non-root container execution                                     │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
│   LAYER 4: EXCHANGE SECURITY                                                │
│   ┌─────────────────────────────────────────────────────────────────────┐   │
│   │  • EIP-712 typed signatures for vault operations                    │   │
│   │  • On-chain settlement (Hyperliquid L1)                             │   │
│   │  • Funds remain on exchange (not custodied by Robonet)              │   │
│   └─────────────────────────────────────────────────────────────────────┘   │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Layer 1** protects your wallet. We use Privy's MPC-based wallet infrastructure, which means your private key is never stored in one place. Signing happens server-side through a distributed process, and you can revoke delegation at any time.

**Layer 2** ensures code safety. Every deployment artifact goes through mandatory security scanning before it can run. We check for known vulnerabilities, malicious patterns, and code integrity issues.

**Layer 3** isolates execution. Each user's agents run in their own isolated environment with strict resource limits. Containers run as non-root users with restricted network access, preventing any cross-contamination between users.

**Layer 4** secures exchange interactions. All vault operations use EIP-712 typed signatures for cryptographic verification. Your funds settle on-chain on Hyperliquid's L1 — Robonet never custodies your assets.

### Key Trust Properties

| Property | How It Works |
|----------|--------------|
| **Fund Custody** | Funds stay on Hyperliquid in your wallet or vault — Robonet can trade but not withdraw |
| **Key Management** | Privy MPC wallets with server-side signing keep keys secure |
| **Code Execution** | Runs on isolated private infrastructure with mandatory security scans |
| **Strategy Code** | Packaged at deployment time with your specific configuration |

### Roadmap: TEE Execution

We're working on adding Trusted Execution Environment (TEE) support, which will provide hardware-level isolation for strategy execution, cryptographic attestation that code runs exactly as expected, and enhanced privacy for proprietary strategies.

*This feature is under development and not yet available.*

---

## Glossary

| Term | Definition |
|------|------------|
| **EOA** | Externally Owned Account — a standard wallet address controlled by a private key |
| **Hyperliquid Vault** | A Hyperliquid smart contract that holds funds separately from your main wallet |
| **Delegation** | One-time authorization allowing Robonet to sign transactions on your behalf |
| **Privy** | Wallet infrastructure provider that enables secure, MPC-based key management |
| **EIP-712** | Ethereum standard for typed, structured data signing (used for vault operations) |
| **Timeframe** | The candle interval your strategy uses for analysis (1m, 1h, 4h, etc.) |
| **Leverage** | Multiplier for your position size — 2x leverage means 2x gains but also 2x losses |
| **Perpetuals** | Futures contracts without expiration dates, allowing indefinite position holding |
| **TEE** | Trusted Execution Environment — hardware-secured code execution with attestation |
| **MPC** | Multi-Party Computation — cryptographic technique where no single party holds the complete key |

