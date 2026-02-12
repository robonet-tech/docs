# Polymarket Strategies

Robonet supports building and deploying automated strategies on [Polymarket](https://polymarket.com), the leading prediction market platform. This guide covers how to build, backtest, and deploy prediction market strategies.

## What is Polymarket?

Polymarket is a decentralized prediction market platform where users trade on the outcomes of real-world events. Each market has two tokens — **YES** and **NO** — priced between $0 and $1. When a market resolves, the winning token pays out $1 and the losing token pays $0.

**Example:** A market asking "Will BTC be above $100k on June 1?" might have YES at $0.65 and NO at $0.35. If BTC is above $100k when the market resolves, YES holders receive $1 per token and NO holders receive $0.

## Key Concepts

### Markets and Events

- **Event**: A top-level question or category (e.g., "2025 Fed Rate Decisions")
- **Market**: A specific binary outcome within an event, identified by a **condition ID**
- **Condition ID**: The unique Polymarket identifier for a market — used in all MCP tools and strategy operations

### YES/NO Tokens

Every market has two ERC-1155 tokens on Polygon:

| Token | Priced | Resolves To |
|-------|--------|-------------|
| **YES** | $0–$1 | $1 if outcome happens, $0 otherwise |
| **NO** | $0–$1 | $1 if outcome doesn't happen, $0 otherwise |

YES + NO prices always approximately sum to $1. Your strategy profits by buying tokens below their fair value and either selling later at a higher price or holding to resolution.

### Market Types

Robonet tracks two types of prediction markets:

**Single Markets** — One-time events like "Will X happen by date Y?" Identified by `condition_id`. These resolve once and are done.

**Rolling Series** — Recurring crypto markets like "BTC price up or down in 15 minutes?" that repeat continuously. Identified by `asset` + `interval` (e.g., BTC + 15m). When one market resolves, the next one begins automatically. This is the primary market type for automated trading.

Rolling series use a slug format: `{asset}-up-or-down-{interval}` (e.g., `btc-up-or-down-15m`).

## Architecture Overview

Polymarket trading on Robonet involves several components working together:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POLYMARKET STRATEGY ARCHITECTURE                         │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│   ┌──────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────┐  │
│   │   YOU    │ ──► │   ROBONET    │ ──► │   TRADING    │ ──► │POLYMARKET│  │
│   │  (User)  │     │   BACKEND    │     │    AGENT     │     │   CLOB   │  │
│   └──────────┘     └──────────────┘     └──────────────┘     └──────────┘  │
│                                                                             │
│   • Create strategy  • Deploy vault      • Execute strategy  • Match orders│
│   • Configure params • Setup Safe wallet  • Place orders      • Settle     │
│   • Deposit funds    • Manage lifecycle   • Manage positions    trades     │
│                                                                             │
│                    ┌──────────────────────────────┐                         │
│                    │   POLYGON BLOCKCHAIN          │                        │
│                    │                               │                        │
│                    │  ┌──────────┐  ┌───────────┐  │                        │
│                    │  │  GNOSIS  │  │ ERC-4626  │  │                        │
│                    │  │   SAFE   │  │   VAULT   │  │                        │
│                    │  │(holds $) │  │(accounting)│  │                        │
│                    │  └──────────┘  └───────────┘  │                        │
│                    └──────────────────────────────┘                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

**Gnosis Safe**: Holds the actual USDC funds and executes trades on Polymarket. Deployed automatically per user via a gasless relayer.

**ERC-4626 Vault**: An on-chain tokenized strategy vault that tracks deposits, withdrawals, shares, and PnL. Other users can deposit into your vault.

**Trading Agent**: A containerized process that runs your strategy, connects to Polymarket's CLOB API, and manages the keeper cycle (tend → report → process withdrawals).

## MCP Tools

Robonet provides 4 dedicated MCP tools for Polymarket. For full parameter details and usage examples, see the [MCP Tools Reference](/guide/mcp-tools#prediction-market-tools).

| Tool | Purpose | Pricing |
|------|---------|---------|
| `get_all_prediction_events` | Browse tracked prediction events and their markets | $0.001 |
| `get_prediction_market_data` | Get market metadata and YES/NO price timeseries | $0.001 |
| `create_prediction_market_strategy` | AI-generate a PolymarketStrategy from a description | Max $4.50 |
| `run_prediction_market_backtest` | Test strategy on historical market data | $0.001 |

### Typical Workflow

```
1. get_all_prediction_events        → Find active markets
2. get_prediction_market_data       → Analyze price history
3. create_prediction_market_strategy → Build your strategy
4. run_prediction_market_backtest   → Validate performance
5. Deploy via chat or MCP           → Go live
```

## Building Strategies

### The PolymarketStrategy Base Class

All Polymarket strategies extend `PolymarketStrategy`, which provides the framework for YES/NO token trading. You implement 4 required methods:

```python
class MyStrategy_PM_M(PolymarketStrategy):

    def should_buy_yes(self) -> bool:
        """Return True when YES tokens should be purchased."""
        return self.yes_price < 0.35

    def should_buy_no(self) -> bool:
        """Return True when NO tokens should be purchased."""
        return self.no_price < 0.35

    def go_yes(self):
        """Execute YES purchase. Set self.buy_yes = (qty, price)."""
        qty = self.available_margin / self.yes_price
        self.buy_yes = qty, self.yes_price

    def go_no(self):
        """Execute NO purchase. Set self.buy_no = (qty, price)."""
        qty = self.available_margin / self.no_price
        self.buy_no = qty, self.no_price
```

### Naming Convention

Strategy names follow the format `{Name}_PM_{Risk}` where Risk is `L` (low), `M` (medium), or `H` (high):
- `ValueBuyer_PM_M`
- `MomentumTrader_PM_H`
- `MeanReversion_PM_L`

### Required Methods

| Method | Purpose |
|--------|---------|
| `should_buy_yes()` | Returns `True` when YES tokens should be bought |
| `should_buy_no()` | Returns `True` when NO tokens should be bought |
| `go_yes()` | Execute YES purchase — set `self.buy_yes = (qty, price)` |
| `go_no()` | Execute NO purchase — set `self.buy_no = (qty, price)` |

### Optional Methods

| Method | Purpose |
|--------|---------|
| `should_sell_yes()` | Custom exit logic for YES positions (default: hold to resolution) |
| `should_sell_no()` | Custom exit logic for NO positions |
| `on_resolution(winning_side)` | Called when market resolves (`"yes"` or `"no"`) |
| `update_position()` | Called each candle while a position is open |
| `before()` / `after()` | Lifecycle hooks called before/after each candle |

### Key Properties

| Property | Type | Description |
|----------|------|-------------|
| `self.yes_price` | float | Current YES token price (0–1) |
| `self.no_price` | float | Current NO token price (0–1) |
| `self.yes_position` | Position | YES token position (qty, entry_price, pnl, is_open) |
| `self.no_position` | Position | NO token position |
| `self.available_margin` | float | Available USDC for new positions |
| `self.balance` | float | Total USDC balance |
| `self.market` | Market | Market metadata (question, outcomes, resolution) |
| `self.is_resolved` | bool | Whether the market has resolved |
| `self.resolution` | str/None | Resolution outcome (`"yes"`, `"no"`, or `None`) |
| `self.yes_candles` | ndarray | YES token OHLCV candle data |
| `self.no_candles` | ndarray | NO token OHLCV candle data |
| `self.total_position_value` | float | Combined position value in USDC |
| `self.total_pnl` | float | Combined unrealized PnL |

### Order Variables

| Variable | Description |
|----------|-------------|
| `self.buy_yes = (qty, price)` | Buy YES tokens |
| `self.buy_no = (qty, price)` | Buy NO tokens |
| `self.sell_yes = (qty, price)` | Sell YES tokens |
| `self.sell_no = (qty, price)` | Sell NO tokens |

## Strategy Examples

### Example 1: Value Buyer

Buy tokens when they're significantly underpriced:

```python
class ValueBuyer_PM_M(PolymarketStrategy):
    """Buy tokens trading below fair value thresholds."""

    def should_buy_yes(self) -> bool:
        return self.yes_price < 0.30

    def should_buy_no(self) -> bool:
        return self.no_price < 0.30

    def go_yes(self):
        qty = self.available_margin * 0.5 / self.yes_price
        self.buy_yes = qty, self.yes_price

    def go_no(self):
        qty = self.available_margin * 0.5 / self.no_price
        self.buy_no = qty, self.no_price

    def should_sell_yes(self) -> bool:
        return self.yes_price > 0.70

    def should_sell_no(self) -> bool:
        return self.no_price > 0.70
```

### Example 2: Mean Reversion

Trade token prices that deviate from recent averages:

```python
class MeanReversion_PM_M(PolymarketStrategy):
    """Buy when price drops below moving average, sell when above."""

    @property
    def yes_ma(self):
        """20-period moving average of YES price."""
        if len(self.yes_candles) < 20:
            return self.yes_price
        return self.yes_candles[-20:, 2].mean()  # close prices

    def should_buy_yes(self) -> bool:
        return self.yes_price < self.yes_ma * 0.95  # 5% below MA

    def should_buy_no(self) -> bool:
        return self.no_price < (1 - self.yes_ma) * 0.95

    def go_yes(self):
        qty = self.available_margin * 0.4 / self.yes_price
        self.buy_yes = qty, self.yes_price

    def go_no(self):
        qty = self.available_margin * 0.4 / self.no_price
        self.buy_no = qty, self.no_price

    def should_sell_yes(self) -> bool:
        return self.yes_price > self.yes_ma * 1.05  # 5% above MA
```

### Creating via AI

The fastest way to build a strategy is through AI generation:

**Via Chat Interface:**
```
Create a prediction market strategy called "PriceThreshold" that:
- Buys YES when price < 0.40 (undervalued)
- Buys NO when price > 0.60 (overvalued)
- Uses 50% of available margin per trade
- Exits positions when price returns to 0.45-0.55 range
```

**Via MCP Server:**
```
Use create_prediction_market_strategy to build a "MomentumPM" strategy
that follows YES/NO price momentum using a 10-period lookback
```

## Backtesting

Polymarket strategies support two backtesting modes:

### Single Market Backtest

Test your strategy on one specific market using its condition ID:

```
Backtest "ValueBuyer_PM_M" on condition_id "0xb0eb..."
from 2025-01-01 to 2025-01-30
```

### Rolling Market Backtest

Test across a series of rolling markets. The balance carries forward between markets, simulating real rolling deployment:

```
Backtest "ValueBuyer_PM_M" on BTC 15m rolling markets
from 2025-01-01 to 2025-01-30
```

The rolling backtest automatically:
1. Finds all resolved markets for the given asset + interval in the date range
2. Runs sequential backtests on each market
3. Carries the ending balance forward to the next market
4. Aggregates performance metrics across all markets

### Backtest Metrics

Both modes return:
- **Return & PnL**: Total return, net profit/loss
- **Risk metrics**: Sharpe ratio, Sortino ratio, max drawdown
- **Trade stats**: Win rate, total trades, average win/loss
- **Equity curve**: Downsampled for visualization

::: tip Check Data First
Use `get_data_availability` with `data_type="polymarket"` to verify data exists for your target market and date range before backtesting.
:::

## Deploying a Polymarket Strategy

### Prerequisites

Before deploying, you need:

1. **Connected wallet** — Sign in with your wallet via Privy
2. **Wallet delegation** — One-time authorization for server-side trade signing
3. **POL on Polygon** — At least 10 POL for vault contract deployment gas
4. **USDC.e on Polygon** — Trading capital (minimum 10 USDC)
5. **A backtested strategy** — Validated PolymarketStrategy

### What Happens When You Deploy

When you deploy a Polymarket strategy, the system executes several setup steps:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    POLYMARKET DEPLOYMENT FLOW                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────┐                                                            │
│  │   DEPLOY    │                                                            │
│  │   CLICKED   │                                                            │
│  └──────┬──────┘                                                            │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  1. GNOSIS SAFE DEPLOYMENT (gasless)                    │                │
│  │     • Derive deterministic Safe address from your wallet│                │
│  │     • Deploy via Polymarket relayer (no gas cost)       │                │
│  │     • Safe is reused across deployments                 │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  2. TOKEN APPROVALS (on-chain, user pays gas)           │                │
│  │     • USDC.e approvals for Polymarket contracts         │                │
│  │     • ERC-1155 approvals for exchange contracts         │                │
│  │     • Batched via MultiSend for efficiency              │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  3. VAULT CONTRACT DEPLOYMENT (user pays ~0.3 POL)      │                │
│  │     • Deploy ERC-4626 PolymarketTradingStrategy          │                │
│  │     • Configure: TVL cap, deposit limits, keeper interval│                │
│  │     • Set performance fee and profit unlock time         │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  4. VAULT APPROVAL ON SAFE                              │                │
│  │     • Approve vault to spend Safe's USDC                │                │
│  │     • Required for withdrawal processing                │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────────────────────────────────────────────────┐                │
│  │  5. AGENT LAUNCH                                        │                │
│  │     • Package strategy + config into container          │                │
│  │     • Deploy to isolated hosting environment            │                │
│  │     • Agent connects to Polymarket CLOB                 │                │
│  └─────────────────────────────────────────────────────────┘                │
│         │                                                                   │
│         ▼                                                                   │
│  ┌─────────────┐                                                            │
│  │   RUNNING   │  Agent is live and trading                                │
│  │      ✓      │                                                            │
│  └─────────────┘                                                            │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Configuration Options

| Parameter | Description | Default |
|-----------|-------------|---------|
| **Strategy** | Your PolymarketStrategy name | Required |
| **Market** | Rolling series slug (e.g., `btc-up-or-down-15m`) | Required |
| **Performance Fee** | Fee charged on profits (1–20%) | 10% |
| **Max Deposit Per Wallet** | Per-wallet deposit cap in USDC | 10,000 |

### Limits

- Maximum **1 active Polymarket deployment** per user
- Requires at least **10 POL** on Polygon for gas
- Requires at least **10 USDC.e** on Polygon for trading

## Vault Architecture

Each Polymarket deployment creates an on-chain ERC-4626 tokenized vault on Polygon. This is the same architecture used by institutional DeFi protocols (based on the Yearn V3 pattern).

### How the Vault Works

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VAULT COMPONENTS                                    │
├───────────────────────────────────┬─────────────────────────────────────────┤
│       ERC-4626 VAULT CONTRACT     │           GNOSIS SAFE                   │
├───────────────────────────────────┼─────────────────────────────────────────┤
│                                   │                                         │
│  • Tracks shares & accounting     │  • Holds actual USDC funds              │
│  • Manages deposits/withdrawals   │  • Executes trades on Polymarket        │
│  • Records PnL via keeper reports │  • Approves token contracts             │
│  • Enforces deposit limits        │  • Deterministic per user (CREATE2)     │
│  • ERC-20 share token             │  • Gasless deployment via relayer       │
│                                   │                                         │
└───────────────────────────────────┴─────────────────────────────────────────┘
```

**Deposits** flow: User → Vault Contract → Gnosis Safe (via `_deployFunds`)

**Withdrawals** flow: Gnosis Safe → Vault Contract → User (via keeper fulfillment or direct withdrawal)

### The Keeper Cycle

The trading agent acts as a "keeper" — a privileged role that bridges offchain trading activity with onchain accounting. Every hour, the keeper runs a 3-step cycle:

1. **Tend** — Reports current portfolio positions (token IDs, amounts, prices) to the vault contract. This is how the vault knows what the Safe holds.

2. **Report** — Triggers PnL accounting. The vault calculates total assets from the portfolio data and updates share prices accordingly.

3. **Process Withdrawals** — Iterates the withdrawal queue and fulfills pending requests by moving USDC from the Safe back to the vault.

```
┌───────────────────────────────────────────────────────────┐
│                    KEEPER CYCLE (Hourly)                   │
│                                                           │
│   ┌────────┐     ┌────────┐     ┌─────────────────────┐   │
│   │  TEND  │ ──► │ REPORT │ ──► │ PROCESS WITHDRAWALS │   │
│   │        │     │        │     │                     │   │
│   │ Update │     │ Update │     │ Fulfill pending     │   │
│   │ prices │     │ PnL &  │     │ withdrawal requests │   │
│   │ & pos. │     │ shares │     │ from queue          │   │
│   └────────┘     └────────┘     └─────────────────────┘   │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Deposits and Withdrawals

**Depositing:**
- Other users can deposit USDC into your vault and receive share tokens
- Deposits are only accepted when the vault is active
- Enforced by `totalAssetsLimit` and `maxDepositLimitPerWallet`

**Withdrawing (active vault):**
- Users submit a withdrawal request via `requestToWithdraw()`
- The keeper fulfills the request during its next cycle
- There is a slight delay (up to 1 hour) between requesting and receiving funds

**Withdrawing (deactivated vault):**
- If a vault is deactivated (emergency or shutdown), users can call `withdrawDirect()` for immediate withdrawal
- This bypasses the keeper queue entirely

::: warning Withdrawal Timing
Withdrawals from active vaults are processed by the keeper every ~1 hour. Users won't receive funds instantly — this is by design, since the funds are actively being used for trading in the Gnosis Safe.
:::

### Activate / Deactivate

The keeper can activate or deactivate a vault:

| State | Deposits | Withdrawal Requests | Direct Withdrawal | Trading |
|-------|----------|--------------------|--------------------|---------|
| **Active** | Allowed | Allowed | Blocked | Running |
| **Deactivated** | Blocked | Blocked | Allowed | Stopped |

Deactivation acts as a kill switch — it stops all trading and allows depositors to withdraw directly without waiting for the keeper.

## Live Trading Engine

When deployed, the Polymarket trading agent runs a continuous loop:

1. **Market Discovery** — For rolling series, the engine automatically discovers and transitions between markets. When the current market nears resolution (60 seconds before end), it exits positions and waits for the next market.

2. **Candle Loop** — Every minute, the agent fetches the latest candle data from Polymarket's CLOB, updates the database, and executes the strategy.

3. **Order Execution** — Orders are placed through the CLOB API using the Gnosis Safe as the trading entity. All signing is done server-side through Privy (no raw private keys).

4. **Vault Keeper** — A background thread runs the hourly tend → report → withdrawal cycle to keep onchain accounting in sync.

### Authentication

The agent authenticates with Polymarket using:
- **Gnosis Safe** as the trading wallet (holds funds, executes trades)
- **Privy delegated signing** for all cryptographic operations (MPC-secured, no private key exposure)
- **CLOB API credentials** derived from the Safe's signing authority at agent startup

## Security Model

| Layer | Protection |
|-------|------------|
| **Fund custody** | USDC held in user's Gnosis Safe on Polygon — Robonet can trade but not withdraw to external addresses |
| **Signing** | All signatures via Privy MPC — no private keys stored or exposed |
| **Safe deployment** | Deterministic via CREATE2 — same wallet always produces same Safe address |
| **Token approvals** | Limited to Polymarket exchange contracts only |
| **Vault contract** | Audited ERC-4626 pattern with reentrancy guards |
| **Execution** | Containerized, isolated, resource-limited hosting environment |
| **Emergency exit** | Vault deactivation + `withdrawDirect()` for immediate fund recovery |

## Vault Stats and Monitoring

Vault statistics are synced on-chain every 10 minutes and include:

- **Total Value Locked (TVL)** — Total USDC under management
- **Share Price** — Current price per share (reflects PnL)
- **Total Shares** — Outstanding share supply
- **Portfolio** — Active token positions with amounts and prices
- **Performance** — Return percentages for 24h, 7d, 30d, and all-time
- **Withdrawal Queue** — Pending withdrawal requests
- **Active Status** — Whether the vault is accepting deposits

Stopped and failed vaults with remaining deposits continue to be tracked so depositors can always withdraw their funds.

## On-Chain Addresses

### Polygon Mainnet

| Contract | Address |
|----------|---------|
| USDC.e | `0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174` |
| CTF (Conditional Token Framework) | `0x4D97DCd97eC945f40cF65F87097ACe5EA0476045` |
| CTF Exchange | `0x4bFb41d5B3570DeFd03C39a9A4D8dE6Bd8B8982E` |
| Neg Risk CTF Exchange | `0xC5d563A36AE78145C45a50134d48A1215220f80a` |
| Neg Risk Adapter | `0xd91E80cF2E7be2e162c6513ceD06f1dD0dA35296` |

## Tips and Best Practices

**Start with backtesting:**
- Always backtest on rolling markets before deploying — use `asset="BTC"` and `interval="15m"` to test across multiple market cycles
- Check `get_data_availability` first to ensure sufficient historical data

**Strategy design:**
- Keep strategies simple — prediction markets have different dynamics than perpetual futures
- Remember: prices are bounded between 0 and 1, so traditional indicators may need adaptation
- For rolling markets, positions are automatically exited before resolution — design your logic accordingly

**Position sizing:**
- Don't go all-in — use `self.available_margin * fraction` for partial allocation
- Account for the YES + NO price relationship when sizing positions

**Deployment:**
- Ensure you have enough POL on Polygon for gas before deploying (~10 POL)
- Your Gnosis Safe is reused across deployments — you only deploy it once
- Monitor vault stats through the platform dashboard

**Vault management:**
- Performance fees are charged on profits when the keeper reports
- The profit unlock time is 2 hours — share prices update gradually, not instantly
- If you need to shut down, deactivating the vault lets depositors withdraw directly

## Related Documentation

- [MCP Tools Reference](/guide/mcp-tools#prediction-market-tools) — Full tool parameter details
- [Strategy Creation](/guide/strategies) — General strategy development guide
- [Backtesting](/guide/backtesting) — Testing strategies on historical data
- [Deployment](/guide/strategy-deployment) — Deployment architecture overview
- [Trading Venues](/guide/trading-venues) — All supported trading platforms
- [Billing & Credits](/guide/billing) — Tool pricing details
