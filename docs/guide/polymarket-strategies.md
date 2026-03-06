# Polymarket Strategies

This guide covers how to build trading strategies for Polymarket prediction markets. Polymarket strategies trade **YES/NO binary outcome tokens** — not perpetual futures — and use a dedicated base class with its own set of required methods.

---

## Overview

Polymarket strategies inherit from `PolymarketStrategy` (not the standard `Strategy` class). The key difference: instead of going long or short on a perpetual, your strategy decides whether to buy YES tokens, NO tokens, or both — and when to sell them.

Each candle tick, the engine calls your strategy's signal methods. If `should_buy_yes()` returns `True`, it calls `go_yes()` where you set your order. Same for NO tokens.

::: warning Not Long/Short
Polymarket uses **YES/NO binary tokens**, not long/short positions. Prices are probabilities between 0 and 1. A YES token at 0.70 means the market thinks there's a 70% chance the event happens.
:::

---

## PolymarketStrategy Base Class

```python
from jesse.strategies import PolymarketStrategy

class MyStrategy_PM_15m_M(PolymarketStrategy):
    """My prediction market strategy"""

    # Required methods (must implement all four)
    def should_buy_yes(self) -> bool: ...
    def should_buy_no(self) -> bool: ...
    def go_yes(self) -> None: ...
    def go_no(self) -> None: ...

    # Optional overrides
    def should_sell_yes(self) -> bool: ...
    def should_sell_no(self) -> bool: ...
    def on_resolution(self, winning_side: str) -> None: ...
```

### Required Methods

You must implement all four of these:

| Method | Purpose | When Called |
|--------|---------|------------|
| `should_buy_yes()` → `bool` | Signal to buy YES tokens | Each candle when not in a YES position |
| `should_buy_no()` → `bool` | Signal to buy NO tokens | Each candle when not in a NO position |
| `go_yes()` | Set `self.buy_yes = (qty, price)` | When `should_buy_yes()` returns `True` |
| `go_no()` | Set `self.buy_no = (qty, price)` | When `should_buy_no()` returns `True` |

### Optional Methods

| Method | Purpose | Default Behavior |
|--------|---------|------------------|
| `should_sell_yes()` → `bool` | Signal to sell YES tokens | `False` (hold until resolution) |
| `should_sell_no()` → `bool` | Signal to sell NO tokens | `False` (hold until resolution) |
| `go_exit_yes()` | Set `self.sell_yes = (qty, price)` | Sell entire position at market price |
| `go_exit_no()` | Set `self.sell_no = (qty, price)` | Sell entire position at market price |
| `on_resolution(winning_side)` | Handle market resolution | No-op |
| `on_open_position(order)` | Position opened callback | No-op |
| `on_close_position(order)` | Position closed callback (`order=None` if resolution) | No-op |
| `on_increased_position(order)` | Position size increased | No-op |
| `on_reduced_position(order)` | Position size decreased | No-op |
| `before()` | Called before strategy logic each candle | No-op |
| `after()` | Called after strategy logic each candle | No-op |
| `update_position()` | Called each candle when position is open | No-op |
| `should_cancel_entry()` → `bool` | Cancel unfilled entry orders each candle | `True` |

---

## Key Properties

### Price Properties

| Property | Type | Description |
|----------|------|-------------|
| `self.yes_price` | `float` | Current YES token price (0 to 1) |
| `self.no_price` | `float` | Current NO token price (0 to 1) |
| `self.price` | `float` | Alias for YES price (from candle data) |

### Position Properties

| Property | Type | Description |
|----------|------|-------------|
| `self.yes_position` | `PolymarketPosition` | YES token position object |
| `self.no_position` | `PolymarketPosition` | NO token position object |

Each position object has these attributes:

```python
self.yes_position.is_open       # bool — position currently open?
self.yes_position.qty           # float — token quantity held
self.yes_position.avg_price     # float — average entry price
self.yes_position.value         # float — current value in USDC
self.yes_position.pnl           # float — unrealized profit/loss
self.yes_position.current_price # float — current token price
```

### Balance Properties

| Property | Type | Description |
|----------|------|-------------|
| `self.available_margin` | `float` | Available USDC for new positions |
| `self.balance` | `float` | Total USDC wallet balance |
| `self.total_position_value` | `float` | Combined YES + NO position value |
| `self.total_pnl` | `float` | Combined unrealized PnL |

### Market Properties

| Property | Type | Description |
|----------|------|-------------|
| `self.market` | `PolymarketMarket` | Market metadata (question, outcomes, asset, interval) |
| `self.is_resolved` | `bool` | Whether the market has resolved |
| `self.resolution` | `str \| None` | Resolution outcome: `'yes'`, `'no'`, or `None` |

### Trade Tracking

| Property | Type | Description |
|----------|------|-------------|
| `self.trades` | `list` | List of completed `PolymarketClosedTrade` objects |
| `self.last_pm_trade` | object | Most recent completed trade |
| `self.pm_trades_count` | `int` | Number of completed trades |

---

## Price Constraints

Polymarket token prices are **probabilities**:

- Prices must be between **0 and 1** (exclusive)
- `YES price + NO price ≈ 1.0` (they sum to approximately 1.0)
- A YES token at **0.75** means the market prices a 75% probability the event occurs
- A NO token at **0.25** means a 25% probability the event does NOT occur

::: danger Prices Are Not Dollar Amounts
Do **not** multiply prices by 100 or treat them as dollar values. `0.75` means 75 cents per token, not $75. If you set `self.buy_yes = (qty, 0.75 * 100)`, your order will be rejected.
:::

---

## Resolution Mechanics

When a prediction market resolves:

- **Winning token** → redeemable at **$1.00** per token
- **Losing token** → worth **$0.00**

For example, if you hold 100 YES tokens and the market resolves YES:
- Your 100 YES tokens are worth 100 × $1.00 = $100.00
- Any NO tokens you held are worth $0.00

The `on_resolution(winning_side)` callback fires with `'yes'` or `'no'` so your strategy can log or react to the outcome.

---

## Rolling Markets

Rolling markets are sequential, time-bounded prediction markets on the same underlying asset. For example, "Will BTC go up in the next 15 minutes?" repeats every 15 minutes as a new market.

**Key behaviors:**
- Your strategy auto-transitions to the next market when the current one resolves
- Resolution settlement happens automatically — winning tokens pay out $1.00, losing tokens expire
- Balance carries forward between markets
- The live engine automatically exits positions **60 seconds before resolution** (`PRE_RESOLUTION_EXIT_SECONDS`) to avoid holding through settlement — this is handled at the engine level, not in your strategy code
- Rolling markets have an `asset` (e.g., "BTC") and `interval` (e.g., "15m")

### Market Slugs

Polymarket markets are identified by slugs, not trading pairs:

| Slug Example | Description |
|-------------|-------------|
| `btc-up-or-down-15m` | BTC price direction, 15-minute rolling |
| `eth-up-or-down-1h` | ETH price direction, 1-hour rolling |
| `will-btc-hit-100k-by-march` | One-time event market |

When deploying via the MCP server or API, use the market slug as the `symbol` parameter.

---

## Naming Convention

Polymarket strategies follow this naming pattern:

```
{StrategyName}_PM_{Risk}
```

| Component | Description | Examples |
|-----------|-------------|----------|
| `StrategyName` | Descriptive name | `ValueBuyer`, `MomentumTrader` |
| `PM` | Indicates Polymarket strategy | Always `PM` |
| `Risk` | Risk level suffix | `L` (low), `M` (medium), `H` (high) |

**Risk levels for prediction markets:**

> These are recommended guidelines for strategy design, not platform-enforced constraints. You can use any margin percentage or entry threshold — these conventions help communicate intent through the strategy name suffix.

| Level | Margin per Trade | Entry Threshold |
|-------|-----------------|-----------------|
| **Low (L)** | 25-30% of available margin | Tight — enter only when price < 0.30 |
| **Medium (M)** | 40-50% of available margin | Moderate — enter when price < 0.45 |
| **High (H)** | 60-80% of available margin | Aggressive — enter when price < 0.50 |

**Examples:** `ValueBuyer_PM_M`, `PriceThreshold_PM_L`, `MomentumTrader_PM_H`

---

## Backtesting

### Single Market Backtest

Test your strategy against one specific market by its condition ID:

```
Use run_prediction_market_backtest on "ValueBuyer_PM_M"
  with condition_id="0xb0eb..."
  from 2025-01-01 to 2025-01-30
```

### Rolling Market Backtest

Test across a series of rolling markets for an asset and interval:

```
Use run_prediction_market_backtest on "ValueBuyer_PM_M"
  with asset="BTC" interval="15m"
  from 2025-01-01 to 2025-01-15
```

Rolling backtests chain multiple markets together, carrying balance forward through resolution settlements — just like live trading.

Use the `get_data_availability` MCP tool with `data_type="polymarket"` to check which markets have historical data before backtesting.

---

## Example Strategy

Here's a complete strategy that buys undervalued tokens — YES tokens when the market underprices the event, NO tokens when it overprices:

```python
from jesse.strategies import PolymarketStrategy


class ValueBuyer_PM_M(PolymarketStrategy):
    """
    Buy YES when price is low (undervalued), buy NO when YES price
    is high (overvalued). Sell when price moves toward fair value.
    Medium risk: 50% margin per trade, moderate thresholds.
    """

    # --- Required: Entry signals ---

    def should_buy_yes(self) -> bool:
        """Buy YES when it's cheap (< 0.40) and we don't already hold"""
        return not self.yes_position.is_open and self.yes_price < 0.40

    def should_buy_no(self) -> bool:
        """Buy NO when YES is expensive (> 0.60) and we don't already hold"""
        return not self.no_position.is_open and self.no_price < 0.40

    # --- Required: Entry execution ---

    def go_yes(self) -> None:
        """Use 50% of available margin for YES position"""
        qty = (self.available_margin * 0.5) / self.yes_price
        self.buy_yes = (qty, self.yes_price)

    def go_no(self) -> None:
        """Use 50% of available margin for NO position"""
        qty = (self.available_margin * 0.5) / self.no_price
        self.buy_no = (qty, self.no_price)

    # --- Optional: Exit signals ---

    def should_sell_yes(self) -> bool:
        """Take profit when YES moves above 0.60"""
        return self.yes_position.is_open and self.yes_price > 0.60

    def should_sell_no(self) -> bool:
        """Take profit when NO moves above 0.60"""
        return self.no_position.is_open and self.no_price > 0.60

    # --- Optional: Resolution handling ---

    def on_resolution(self, winning_side: str) -> None:
        """Log resolution outcome"""
        pass
```

**What this strategy does:**

1. Watches YES and NO token prices each minute (1m candles)
2. If YES is trading below 0.40 — buys YES tokens with 50% of available capital
3. If NO is trading below 0.40 — buys NO tokens with 50% of available capital
4. Takes profit when either token climbs above 0.60
5. If neither exit triggers, positions resolve at market end (winning = $1.00, losing = $0.00)

**Position sizing:** `qty = margin_amount / token_price`. At a YES price of 0.35 with $5,000 margin, you'd buy ~14,285 YES tokens.

---

## Common Mistakes

```python
# ❌ WRONG — Using regular Strategy base class
from jesse.strategies import Strategy  # Should be PolymarketStrategy

# ❌ WRONG — Using long/short methods
def should_long(self): ...    # Should be should_buy_yes
def should_short(self): ...   # Should be should_buy_no
self.buy = (qty, price)       # Should be self.buy_yes or self.buy_no

# ❌ WRONG — Price not in 0-1 range
self.buy_yes = (qty, 0.75 * 100)  # 75 is wrong, use 0.75

# ❌ WRONG — Using wrong position object
if self.position.is_open: ...  # Should be self.yes_position.is_open

# ✅ CORRECT
from jesse.strategies import PolymarketStrategy

def should_buy_yes(self) -> bool:
    return not self.yes_position.is_open and self.yes_price < 0.45
```

---

## Order Execution Reference

```python
# Buy YES tokens — tuple (quantity, price) or list of tuples
self.buy_yes = (qty, price)
self.buy_yes = [(qty1, price1), (qty2, price2)]  # Multiple orders

# Buy NO tokens
self.buy_no = (qty, price)

# Sell YES tokens (use in should_sell_yes / go_exit_yes / update_position)
self.sell_yes = (qty, price)

# Sell NO tokens
self.sell_no = (qty, price)
```

The default 2% Polymarket taker fee applies to all trades.

---

## Strategy File Structure

Place your strategy in the standard directory structure:

```
strategies/
  ValueBuyer_PM_M/
    __init__.py      ← Your strategy implementation
```

The `__init__.py` file contains your `PolymarketStrategy` subclass. The directory name must match the class name.

---

## Related Documentation

- [Polymarket Deployments](/guide/polymarket-deployments) — Deploy your strategy to live trading
- [MCP Tools Reference](/guide/mcp-tools) — `create_prediction_market_strategy`, `run_prediction_market_backtest`, and other PM tools
- [Strategy Creation](/guide/strategies) — General strategy development guide (Hyperliquid)
- [Backtesting](/guide/backtesting) — Backtesting fundamentals
