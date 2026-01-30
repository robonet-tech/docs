# Strategy Backtesting

Robonet backtests run on the Jesse Framework with production-grade historical data from Hyperliquid. This guide covers execution, parameters, and result interpretation.

## Running Backtests

### Chat Interface

Request backtests conversationally:
```
"Backtest MomentumStrategy on ETH-USDC from 2024-01-01 to 2024-06-30 using 4h timeframe"
"Run a backtest on BTC-USDC for the last 6 months"
```

Results display as equity curve charts and performance metrics. See [Chat Interface Guide](/guide/chat-interface) for details.

### MCP Server

Use the `run_backtest` tool programmatically:

```json
{
  "strategy_name": "MomentumStrategy",
  "symbol": "BTC-USDC",
  "timeframe": "4h",
  "start_date": "2024-01-01",
  "end_date": "2024-06-30"
}
```

Returns structured JSON with metrics and equity curve data. See [MCP Tools Reference](/reference/mcp-tools#run-backtest) for complete API documentation.

## Parameters

### Required

| Parameter | Description | Format | Example |
|-----------|-------------|--------|---------|
| **strategy_name** | Strategy identifier | String | `MomentumStrategy` |
| **symbol** | Trading pair | BASE-QUOTE | `BTC-USDC`, `ETH-USDC` |
| **timeframe** | Candle interval | 1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1D, 3D, 1W | `4h`, `1D` |
| **start_date** | Backtest start | YYYY-MM-DD | `2024-01-01` |
| **end_date** | Backtest end | YYYY-MM-DD | `2024-06-30` |

### Optional

| Parameter | Description | Default | Valid Range |
|-----------|-------------|---------|-------------|
| **starting_balance** | Initial capital (USDC) | 10,000 | 100 - 1,000,000 |
| **leverage** | Position leverage | 1x | 1x - 10x |
| **fee** | Trading fee percentage | 0.04% | 0% - 1% |
| **slippage** | Expected slippage | 0.1% | 0% - 2% |
| **warmup_candles** | Indicator warmup period | 300 | 50 - 1000 |

Default fee (0.04%) matches Hyperliquid's maker/taker rates. Default slippage (0.1%) is conservative for typical market conditions.

**MCP example with custom config:**
```json
{
  "strategy_name": "MomentumStrategy",
  "symbol": "BTC-USDC",
  "timeframe": "4h",
  "start_date": "2024-01-01",
  "end_date": "2024-06-30",
  "config": {
    "starting_balance": 50000,
    "leverage": 2,
    "fee": 0.0005,
    "slippage": 0.002
  }
}
```

## Result Metrics

### Returns

| Metric | Description | Target |
|--------|-------------|--------|
| **Total Return** | Cumulative P&L percentage | Positive |
| **Annual Return** | Annualized return rate | >15-20% |
| **Net Profit** | Total P&L in USDC after fees | Positive |
| **Profit Factor** | Gross profit ÷ Gross loss | >1.5 |

### Risk

| Metric | Description | Target |
|--------|-------------|--------|
| **Max Drawdown** | Largest peak-to-trough decline | <20% |
| **Sharpe Ratio** | Risk-adjusted returns (volatility) | >1.0 |
| **Sortino Ratio** | Risk-adjusted returns (downside only) | >1.5 |
| **Calmar Ratio** | Annual return ÷ Max drawdown | >1.0 |

### Trade Statistics

| Metric | Description | Typical |
|--------|-------------|---------|
| **Win Rate** | Percentage of winning trades | 45-65% |
| **Total Trades** | Number of trades executed | 30+ for statistical significance |
| **Average Win/Loss** | Mean profit vs mean loss per trade | Win > Loss |
| **Expectancy** | Expected profit per trade | Positive |
| **Max Winning/Losing Streak** | Longest consecutive run | — |

### Position Breakdown

| Metric | Description |
|--------|-------------|
| **Longs Count / Shorts Count** | Long vs short position count |
| **Longs % / Shorts %** | Directional bias percentage |
| **Average Holding Period** | Mean trade duration (hours) |

### Equity Curve

Results include equity curve data (timestamp and portfolio value pairs) for charting. Look for steady progression, reasonable drawdown depth/duration, and consistency across market regimes.

### No Trades Generated

If a backtest produces zero trades:
- Entry conditions may be too restrictive
- Timeframe may not match indicator requirements
- Date range may be insufficient for strategy logic
- Symbol volatility may not trigger conditions

Test longer periods, different timeframes, or adjust entry thresholds.

## Data & Execution

### Historical Data

- **Source**: Hyperliquid production OHLCV candles
- **Symbols**: All Hyperliquid Perpetual pairs (BTC-USDC, ETH-USDC, SOL-USDC, etc.)
- **Timeframes**: 1m, 3m, 5m, 15m, 30m, 45m, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 1D, 3D, 1W, 1M
- **History depth**: 1-3 years depending on symbol
- **Quality**: No gaps or missing data

If a symbol/timeframe combination lacks sufficient history for your date range, try shorter periods or more established symbols (BTC/ETH have longest history).

### Execution Engine

- **Framework**: [Jesse Framework](https://jesse.trade)
- **Speed**: 20-40 seconds for typical 6-month backtest
- **Price model**: Candle close prices for entry/exit
- **Fees/slippage**: Realistic modeling with configurable parameters

## Validation Best Practices

### Overfitting Prevention

Standard backtesting limitations apply: strategies can be over-optimized for historical data and fail forward. Key indicators of overfitting:

- Win rate >75%
- Very few trades (<30 in test period)
- Dramatic performance drop on out-of-sample data
- Excessive complexity (>10 indicators or conditions)

### Walk-Forward Testing

Validate strategies on multiple time periods:

1. Train on Period A (e.g., 2023)
2. Optimize if needed
3. Validate on Period B (e.g., 2024) without modification
4. Similar performance across periods indicates robustness

**Example: Robust strategy**
```
Training (2023): +32% return, 1.8 Sharpe, 52% win rate
Validation (2024): +28% return, 1.6 Sharpe, 49% win rate
```

**Example: Overfitted strategy**
```
Training (2023): +45% return, 2.5 Sharpe, 78% win rate
Validation (2024): -8% return, 0.3 Sharpe, 42% win rate
```

### Other Limitations

- Market regime changes may invalidate historical patterns
- Backtests don't capture exchange outages, liquidity gaps, or execution issues
- Slippage can exceed assumptions during high volatility
- Ensure indicators don't use look-ahead data

## Common Issues

| Issue | Solution |
|-------|----------|
| **No data available** | Symbol/timeframe lacks sufficient history. Try shorter date range or check [Trading Venues](/reference/trading-venues). |
| **No trades generated** | Entry conditions too restrictive. Test longer periods or adjust thresholds. |
| **Slow execution (>2 min)** | Long date ranges (>2 years) or high-frequency timeframes (1m). Use shorter ranges or lower frequency. |

## Related Documentation

- [Strategy Optimization](/guide/optimization) - Parameter tuning and grid search
- [Allora Integration](/guide/allora) - Enhance strategies with ML predictions
- [Deployment Guide](/guide/deployment) - Deploy validated strategies to production
- [MCP Tools Reference](/reference/mcp-tools#run-backtest) - Complete API documentation
- [Jesse Framework Docs](https://docs.jesse.trade/) - Underlying backtesting engine
