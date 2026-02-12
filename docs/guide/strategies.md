# Strategy Development Guide

This guide explains how to create, structure, and refine trading strategies on Robonet.

## Overview

Robonet strategies are Python classes that inherit from the Jesse trading framework. The platform generates strategy code based on your natural language descriptions, but understanding the structure helps you create better strategies and communicate your requirements more effectively.

## Strategy Types

Robonet supports two types of strategies:

- **Perpetual Futures Strategies** — Trade long/short on Hyperliquid using the `Strategy` base class with `should_long()` / `should_short()` methods. Covered in this guide.
- **Prediction Market Strategies** — Trade YES/NO tokens on Polymarket using the `PolymarketStrategy` base class with `should_buy_yes()` / `should_buy_no()` methods. See the [Polymarket Strategies guide](/guide/polymarket#building-strategies) for details.

The rest of this page covers perpetual futures strategy development.

## Strategy Structure

Every strategy must implement these core methods:

### Required Methods

| Method | Purpose | Returns |
|--------|---------|---------|
| `should_long()` | Check if conditions are met to enter long | `bool` |
| `should_short()` | Check if conditions are met to enter short | `bool` |
| `go_long()` | Execute long entry with position sizing | None |
| `go_short()` | Execute short entry with position sizing | None |

### Optional Methods

| Method | Purpose |
|--------|---------|
| `on_open_position(order)` | Called after position opens - set stop loss, take profit |
| `update_position()` | Called each candle while in position - trailing stops, scaling |
| `should_cancel_entry()` | Cancel unfilled entry orders |

## Basic Strategy Example

Here's a complete RSI mean reversion strategy:

```python
from jesse.strategies import Strategy
import jesse.indicators as ta

class RSIMeanReversion_M(Strategy):

    @property
    def rsi(self):
        """RSI indicator cached as property for efficiency"""
        return ta.rsi(self.candles, period=14)

    def should_long(self) -> bool:
        # Enter long when RSI drops below 30 (oversold)
        return self.rsi < 30

    def should_short(self) -> bool:
        # Enter short when RSI rises above 70 (overbought)
        return self.rsi > 70

    def go_long(self):
        # Use 95% of available margin
        qty = (self.available_margin * 0.95) / self.price
        self.buy = qty, self.price

    def go_short(self):
        qty = (self.available_margin * 0.95) / self.price
        self.sell = qty, self.price

    def on_open_position(self, order):
        # Set 2% stop loss and 4% take profit
        if self.is_long:
            self.stop_loss = self.position.qty, self.price * 0.98
            self.take_profit = self.position.qty, self.price * 1.04
        else:
            self.stop_loss = self.position.qty, self.price * 1.02
            self.take_profit = self.position.qty, self.price * 0.96
```

## Available Indicators

Robonet provides 170+ technical indicators via `jesse.indicators`. Use the `get_all_technical_indicators` MCP tool to see the complete list.

### Common Indicators

| Indicator | Function | Example |
|-----------|----------|---------|
| RSI | `ta.rsi(candles, period)` | `ta.rsi(self.candles, 14)` |
| EMA | `ta.ema(candles, period)` | `ta.ema(self.candles, 21)` |
| SMA | `ta.sma(candles, period)` | `ta.sma(self.candles, 50)` |
| MACD | `ta.macd(candles)` | Returns (macd, signal, hist) |
| Bollinger Bands | `ta.bollinger_bands(candles)` | Returns (upper, middle, lower) |
| ATR | `ta.atr(candles, period)` | `ta.atr(self.candles, 14)` |
| Stochastic | `ta.stoch(candles)` | Returns (k, d) |
| ADX | `ta.adx(candles, period)` | `ta.adx(self.candles, 14)` |
| Supertrend | `ta.supertrend(candles)` | Returns (trend, direction) |

### Using Sequential Data

For crossover detection, use `sequential=True`:

```python
@property
def ema_fast(self):
    return ta.ema(self.candles, 9, sequential=True)

@property
def ema_slow(self):
    return ta.ema(self.candles, 21, sequential=True)

def should_long(self) -> bool:
    # Detect EMA crossover
    fast = self.ema_fast
    slow = self.ema_slow
    return fast[-2] <= slow[-2] and fast[-1] > slow[-1]
```

## Position Sizing

**Always use `self.available_margin`** for position sizing:

```python
# Correct - uses available margin
qty = (self.available_margin * 0.95) / self.price

# Incorrect - don't use these
qty = (self.balance * 0.95) / self.price      # Wrong
qty = (self.capital * 0.95) / self.price      # Wrong
```

### Risk-Based Position Sizing

Use `utils.risk_to_qty()` for risk-based sizing:

```python
from jesse import utils

def go_long(self):
    # Risk 2% of capital with stop at 1.5x ATR
    stop_price = self.price - (1.5 * self.atr)
    qty = utils.risk_to_qty(
        self.available_margin,
        0.02,  # 2% risk
        self.price,
        stop_price
    )
    self.buy = qty, self.price
```

## Risk Management

### Stop Loss and Take Profit

Set in `on_open_position()` after entry:

```python
def on_open_position(self, order):
    if self.is_long:
        self.stop_loss = self.position.qty, self.price * 0.98    # 2% stop
        self.take_profit = self.position.qty, self.price * 1.04  # 4% target
    else:
        self.stop_loss = self.position.qty, self.price * 1.02
        self.take_profit = self.position.qty, self.price * 0.96
```

### ATR-Based Dynamic Stops

Stops that adapt to market volatility:

```python
@property
def atr(self):
    return ta.atr(self.candles, period=14)

def on_open_position(self, order):
    if self.is_long:
        self.stop_loss = self.position.qty, self.price - (2 * self.atr)
        self.take_profit = self.position.qty, self.price + (3 * self.atr)
    else:
        self.stop_loss = self.position.qty, self.price + (2 * self.atr)
        self.take_profit = self.position.qty, self.price - (3 * self.atr)
```

### Trailing Stops

Use `update_position()` for trailing stops:

```python
def update_position(self):
    if self.is_long:
        # Trail stop at 1.5x ATR below highest price
        new_stop = self.high - (1.5 * self.atr)
        current_stop = self.position.stop_loss
        if new_stop > current_stop:
            self.stop_loss = self.position.qty, new_stop
```

## Strategy Naming Convention

Strategies follow the pattern: `{Name}_{RiskLevel}[_suffix]`

| Component | Values | Example |
|-----------|--------|---------|
| Name | Descriptive name | MomentumBreakout |
| Risk Level | H (high), M (medium), L (low) | M |
| Suffix | Version or enhancement | _optimized, _allora, _v2 |

**Perpetual Futures Examples:**
- `RSIMeanReversion_M` - Base strategy, medium risk
- `RSIMeanReversion_M_optimized` - After optimization
- `RSIMeanReversion_M_allora` - With Allora ML enhancement
- `RSIMeanReversion_M_v2` - Refined version

**Prediction Market Examples** (use `_PM_` suffix):
- `ValueBuyer_PM_M` - Polymarket strategy, medium risk
- `MomentumTrader_PM_H` - Polymarket strategy, high risk

## Creating Strategies via Chat

The easiest way to create strategies is through natural language:

```
Create a momentum strategy that:
- Enters long when RSI crosses above 30 from below
- Uses EMA crossover (9/21) for confirmation
- Sets 2% stop loss and 4% take profit
- Trades BTC-USDT on 4h timeframe
```

The AI will generate complete, validated strategy code using the `create_strategy` tool.

### Tips for Good Strategy Descriptions

1. **Be specific about entry conditions** - Which indicators? What thresholds?
2. **Define exit conditions** - Stop loss, take profit, or signal-based exits
3. **Specify risk management** - Position sizing, max drawdown limits
4. **Mention the target asset and timeframe** - BTC-USDT on 4h, ETH-USDT on 1h

## Optimizing Strategies

After creating a strategy, improve its parameters:

```
Optimize RSIMeanReversion_M for BTC-USDT 4h from 2024-01-01 to 2025-01-01
```

The `optimize_strategy` tool adjusts:
- Indicator periods (RSI length, EMA periods)
- Entry/exit thresholds
- Risk management parameters
- Creates a new `_optimized` version

## Enhancing with Allora ML

Add machine learning predictions:

```
Enhance RSIMeanReversion_M with Allora predictions for BTC-USDT 8h
```

The `enhance_with_allora` tool:
- Integrates Allora Network price predictions
- Filters signals using ML forecasts
- Adjusts position sizing based on prediction confidence
- Creates a new `_allora` version

## Refining Strategies

Make targeted improvements:

```
Refine RSIMeanReversion_M to add RSI confirmation filter -
only enter when RSI is below 40 for longs and above 60 for shorts
```

The `refine_strategy` tool:
- Applies specific changes you describe
- Supports `mode="new"` (create version) or `mode="replace"` (overwrite)
- Validates changes before saving

## Common Strategy Patterns

### Trend Following

```python
def should_long(self) -> bool:
    return (
        self.close > ta.ema(self.candles, 50) and  # Above trend
        ta.adx(self.candles, 14) > 25 and          # Strong trend
        self.rsi > 50                               # Momentum confirms
    )
```

### Mean Reversion

```python
def should_long(self) -> bool:
    bb = ta.bollinger_bands(self.candles, 20, 2)
    return (
        self.close < bb.lower and  # Price at lower band
        self.rsi < 30               # Oversold
    )
```

### Breakout

```python
def should_long(self) -> bool:
    highest = max(self.candles[-20:, 3])  # 20-period high
    return (
        self.close > highest and           # Breakout
        self.volume > ta.sma(self.candles[:, 5], 20) * 1.5  # Volume confirms
    )
```

## Best Practices

1. **Start simple** - Basic strategies often outperform complex ones
2. **Backtest thoroughly** - Test on 6+ months of data across different market conditions
3. **Avoid overfitting** - Don't optimize on the same data you test on
4. **Use stop losses** - Always protect against large losses
5. **Position size conservatively** - Never risk more than you can afford to lose
6. **Check data availability** - Use `get_data_availability` before backtesting
7. **Version your strategies** - Use `mode="new"` in refine_strategy to preserve working versions

## Available Data

Check what's available before backtesting:

```
Check data availability for BTC-USDT
```

Current coverage:
- **BTC-USDT**: January 2020 - present
- **ETH-USDT**: January 2020 - present
- **Other pairs**: Varies by symbol (use `get_data_availability` to check)

## Next Steps

- [Backtesting Guide](/guide/backtesting) - Test your strategies on historical data
- [Optimization Guide](/guide/optimization) - Improve strategy parameters
- [Allora Integration](/guide/allora) - Add ML predictions
- [Polymarket Strategies](/guide/polymarket) - Build prediction market strategies
- [Deployment Guide](/guide/strategy-deployment) - Deploy to live trading
- [MCP Tools Reference](/guide/mcp-tools) - Complete tool documentation
