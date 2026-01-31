# Allora AI Price Predictions

Allora Network provides machine learning-powered price predictions that can enhance your trading strategies. This guide explains how Allora predictions work and how to leverage them in your strategies.

## What is Allora Network?

[Allora Network](https://allora.network) is a decentralized AI network that generates price predictions for cryptocurrencies using machine learning models. These predictions are produced by a network of inference nodes and validated through blockchain consensus.

**Features:**
- **Decentralized ML Predictions**: Multiple inference nodes contribute predictions, aggregated on-chain
- **Multiple Horizons**: Predictions available for different timeframes (5m, 8h, 24h, 1 week)
- **Two Prediction Types**:
  - **Log Return**: Expected percentage change (e.g., 0.03 = +3% expected return)
  - **Absolute Price**: Direct price prediction (e.g., ETH at $2,450 in 8 hours)
- **On-Chain Consensus**: Predictions use outlier-resistant aggregation and consensus timestamps
- **Historical Data**: Full prediction history available for backtesting

## Available Predictions

Robonet provides access to Allora predictions through two networks:

### Mainnet Topics (10 Available)

| Symbol | Horizon | Type | Topic ID |
|--------|---------|------|----------|
| BTC-USD | 8h | Log Return | 1 |
| ETH-USD | 8h | Log Return | 2 |
| SOL-USD | 8h | Log Return | 3 |
| ETH-USD | 8h | Price | 9 |
| SOL-USD | 8h | Price | 10 |
| BTC-USD | 8h | Price | 14 |
| BTC-USD | 24h | Log Return | 15 |
| ETH-USD | 24h | Log Return | 16 |
| SOL-USD | 24h | Log Return | 17 |
| BTC-USD | 20m | Log Return | 18 |
| NEAR-USD | 8h | Log Return | 19 |

### Testnet Topics (26 Available)

Testnet provides extended coverage with more symbols and horizons:
- **Horizons**: 5m, 8h, 24h, 1 week
- **Symbols**: BTC, ETH, SOL, NEAR
- **Types**: Both price and log_return predictions

::: tip
Use testnet for development and experimentation before deploying to mainnet. Testnet predictions are free and have more variety for testing different strategies.
:::

## How Allora Predictions Work

### Understanding Log Return Predictions

Log return predictions express the expected price change as a percentage:

```
log_return = log(future_price) - log(current_price)
```

**Example Interpretation:**
- `log_return = 0.03` → Expect ~+3% price increase
- `log_return = -0.02` → Expect ~-2% price decrease
- `log_return = 0` → Expect no significant change

**Threshold-Based Signals:**
```python
if log_return > 0.01:    # +1% threshold
    signal = "Long"
elif log_return < -0.01: # -1% threshold
    signal = "Short"
else:
    signal = "Neutral"
```

### Understanding Price Predictions

Price predictions provide direct price targets:

```python
predicted_price = 2450.00  # ETH predicted at $2,450
current_price = 2400.00    # ETH currently at $2,400

# Calculate implied log return
log_return = log(predicted_price) - log(current_price)
# log_return ≈ 0.0206 (≈2% expected gain)
```

### Prediction Lifecycle

```
Allora Network → PostgreSQL → Strategy.get_predictions() → Trading Decision
     ↓              ↓                     ↓                        ↓
  Inference    Stored with       Filtered by time        Entry/Exit Signal
   Nodes       timestamp         (backtesting safe)
```

1. **Generation**: Inference nodes produce predictions
2. **Consensus**: On-chain aggregation with outlier resistance
3. **Storage**: Predictions stored with consensus timestamps
4. **Access**: Strategies retrieve predictions via `get_predictions()`
5. **Usage**: Time-aware filtering prevents look-ahead bias

## Enabling Allora in Strategies

### Method 1: AI Enhancement (Recommended)

The easiest way to add Allora predictions to an existing strategy is through AI enhancement.

#### Via Chat Interface

Simply ask:
```
"Enhance my strategy 'MyTrendFollower' with Allora predictions for BTC-USDT on the 8h timeframe"
```

The AI will:
1. Analyze your existing strategy logic
2. Identify optimal integration points
3. Add Allora prediction signals
4. Preserve your risk management rules
5. Run before/after backtests for comparison

#### Via MCP Server

```python
# In your AI coding agent (Claude Code, Cursor, etc.)
"Use enhance_with_allora tool to add Allora predictions to MyTrendFollower
strategy for BTC-USDT, 8h timeframe. Compare backtest results from
2024-01-01 to 2024-12-31."
```

The MCP tool provides:
- Side-by-side performance comparison
- Integration recommendations
- Risk-adjusted improvement metrics

::: tip Cost-Effective Testing
Use `generate_ideas` tool first ($0.05) to explore Allora integration approaches, then use `enhance_with_allora` ($0.25-0.50) for implementation. This saves credits while exploring options.
:::

### Method 2: Direct Integration

For full control, integrate Allora predictions directly in your strategy code.

#### Basic Integration Pattern

```python
from jesse.strategies import Strategy
import jesse.indicators as ta
from jesse import utils

class MyAlloraStrategy(Strategy):

    @property
    def eth_prediction(self):
        """Get latest ETH 8h log return prediction"""
        try:
            predictions = self.get_predictions(
                symbol='ETH-USDT',
                horizon='8h',
                prediction_type='log_return'
            )
            return predictions[-1]['value'] if predictions else 0
        except:
            return 0

    def should_long(self):
        # Long when prediction > 2%
        return self.eth_prediction > 0.02

    def should_short(self):
        # Short when prediction < -2%
        return self.eth_prediction < -0.02

    def go_long(self):
        qty = utils.size_to_qty(
            self.available_margin,
            self.price,
            fee_rate=self.fee_rate
        )
        self.buy = qty, self.price

    def go_short(self):
        qty = utils.size_to_qty(
            self.available_margin,
            self.price,
            fee_rate=self.fee_rate
        )
        self.sell = qty, self.price
```

#### Advanced Integration: Ensemble Strategy

Combine Allora predictions with technical analysis:

```python
class EnsembleStrategy(Strategy):

    @property
    def allora_signal(self):
        """Get Allora prediction signal"""
        predictions = self.get_predictions('ETH-USDT', '24h', 'log_return')
        if not predictions:
            return 0

        log_return = predictions[-1]['value']
        if log_return > 0.01:
            return 1   # Bullish
        elif log_return < -0.01:
            return -1  # Bearish
        return 0       # Neutral

    @property
    def technical_signal(self):
        """Get technical analysis signal"""
        sma_bullish = self.sma_fast > self.sma_slow
        macd_bullish = self.macd.hist > 0
        rsi_oversold = self.rsi < 40
        rsi_overbought = self.rsi > 60

        if sma_bullish and macd_bullish and not rsi_overbought:
            return 1   # Bullish
        elif not sma_bullish and not macd_bullish and not rsi_oversold:
            return -1  # Bearish
        return 0

    def should_long(self):
        # Require BOTH signals to agree
        return (self.allora_signal == 1 and
                self.technical_signal == 1)

    def should_short(self):
        return (self.allora_signal == -1 and
                self.technical_signal == -1)

    def go_long(self):
        # Base position size: 2% risk
        base_qty = utils.risk_to_qty(
            self.available_margin * 0.02,
            entry=self.price,
            stop=self.stop_loss_price,
            fee_rate=self.fee_rate
        )

        # Increase 25% when Allora is highly confident
        predictions = self.get_predictions('ETH-USDT', '24h', 'log_return')
        if predictions and abs(predictions[-1]['value']) > 0.03:
            base_qty *= 1.25

        self.buy = base_qty, self.price
```

## Strategy Examples

### Example 1: Pure Allora Strategy

**Concept:** Trade based solely on 24h log return predictions

**Entry Logic:**
- **Long**: `log_return > 0.01` (>1% expected gain)
- **Short**: `log_return < -0.01` (<-1% expected loss)
- **Neutral**: `-0.01 <= log_return <= 0.01`

**Exit Logic:**
- Exit when signal reverses direction
- Exit when signal weakens below threshold
- Only exit on NEW predictions (not recalculations)

**Position Sizing:**
- Fixed 100% of available margin per trade
- No leverage scaling

**Use Case:** Testing raw Allora prediction accuracy without other factors

### Example 2: Allora + Momentum

**Concept:** Combine Allora predictions with momentum indicators for confirmation

**Entry Logic:**
- **Long**: Allora bullish (`log_return > 0.01`) AND SMA(10) > SMA(20) AND MACD > 0
- **Short**: Allora bearish (`log_return < -0.01`) AND SMA(10) < SMA(20) AND MACD < 0

**Exit Logic:**
- Stop loss: 2 ATR from entry
- Take profit: 3 ATR default, 4 ATR when Allora confidence high
- Trailing stop when Allora continues bullish/bearish

**Position Sizing:**
- Base: 2% risk per trade
- Increase 25% when `abs(log_return) > 0.03` (high confidence)

**Use Case:** Reducing false signals by requiring technical confirmation

### Example 3: 5-Minute Price Predictions

**Concept:** Ultra-short-term trading using 5m price predictions

**Entry Logic:**
- Calculate: `log_return = log(predicted_price) - log(current_price)`
- **Long**: `log_return > 0.002` (>0.2% expected)
- **Short**: `log_return < -0.002` (<-0.2% expected)

**Exit Logic:**
- Time-based: Exit after 5 minutes (next prediction available)
- Stop loss: 0.5% from entry
- Take profit: 0.3% from entry

**Position Sizing:**
- Fixed 50% of available margin
- Allows 2 simultaneous positions

**Use Case:** High-frequency scalping with ML edge

::: warning Prediction Lag
5-minute predictions may have 10-30 second latency from generation to availability. Factor this into your strategy logic to avoid stale signals.
:::

## Interpreting Allora Signals

### Signal Strength Guidelines

| Abs(Log Return) | Strength | Confidence | Recommended Action |
|-----------------|----------|------------|-------------------|
| < 0.01 | Weak | Low | Neutral / No trade |
| 0.01 - 0.02 | Moderate | Medium | Standard position |
| 0.02 - 0.03 | Strong | High | Increase position 15-25% |
| > 0.03 | Very Strong | Very High | Increase position 25-50% |

### Backtesting Best Practices

1. **Use Historical Predictions**: Strategies automatically use time-accurate predictions during backtests
2. **Compare Before/After**: Run backtests with and without Allora to measure improvement
3. **Test Multiple Thresholds**: Experiment with different entry/exit thresholds (0.01, 0.015, 0.02)
4. **Network Selection**: Use testnet for development, mainnet for final validation
5. **Overfitting Awareness**: Avoid over-optimizing on prediction thresholds

### Live Trading Considerations

- **Prediction Availability**: New predictions arrive every 5-60 minutes depending on topic
- **Outlier Filtering**: Allora consensus removes outlier predictions automatically
- **Network Reliability**: Predictions may be delayed during high network congestion
- **Fallback Logic**: Always include fallback behavior when predictions unavailable

```python
@property
def safe_allora_signal(self):
    """Allora signal with fallback to neutral"""
    try:
        predictions = self.get_predictions('ETH-USDT', '8h', 'log_return')
        if not predictions:
            return 0  # Neutral fallback

        log_return = predictions[-1]['value']
        if log_return > 0.01:
            return 1
        elif log_return < -0.01:
            return -1
        return 0
    except Exception as e:
        # Log error and return neutral
        print(f"Allora prediction error: {e}")
        return 0
```

## Getting Allora Topics

To see all available prediction topics:

### Via Chat Interface

```
"What Allora prediction topics are available?"
```

### Via MCP Server

```python
# The get_allora_topics tool returns:
{
  "mainnet": [
    {
      "topic_id": 1,
      "symbol": "BTC-USD",
      "horizon": "8h",
      "prediction_type": "log_return",
      "epoch_seconds": 300
    },
    // ... 9 more topics
  ],
  "testnet": [
    // ... 26 topics
  ]
}
```

### Via Strategy Code

```python
from jesse.services.allora_predictions import (
    TOPIC_MAPPING_MAINNET,
    TOPIC_MAPPING_TESTNET,
    get_topic_mapping
)

# Get all topics for current network
topics = get_topic_mapping(self.network)

# Find specific topic
topic_id = get_topic_id_for_symbol(
    symbol='BTC-USD',
    network='mainnet'
)
```

## Common Integration Patterns

### Pattern 1: Signal Filter

Use Allora as a filter to confirm other signals:

```python
def should_long(self):
    # Primary signal from your strategy
    primary_signal = self.rsi < 30 and self.macd.hist > 0

    # Allora confirmation
    allora_bullish = self.eth_prediction > 0.01

    # Only enter when both agree
    return primary_signal and allora_bullish
```

### Pattern 2: Dynamic Position Sizing

Adjust position size based on prediction strength:

```python
def go_long(self):
    base_qty = utils.size_to_qty(self.available_margin, self.price)

    # Scale based on prediction confidence
    prediction = self.eth_prediction
    if abs(prediction) > 0.03:
        multiplier = 1.5      # 50% larger
    elif abs(prediction) > 0.02:
        multiplier = 1.25     # 25% larger
    else:
        multiplier = 1.0      # Standard size

    self.buy = base_qty * multiplier, self.price
```

### Pattern 3: Dynamic Take Profit

Adjust profit targets based on prediction magnitude:

```python
def update_position(self):
    if self.is_long:
        prediction = self.eth_prediction

        # Higher targets when prediction strong
        if prediction > 0.03:
            take_profit = self.average_entry_price * 1.04  # +4%
        elif prediction > 0.02:
            take_profit = self.average_entry_price * 1.03  # +3%
        else:
            take_profit = self.average_entry_price * 1.02  # +2%

        # Place take profit order
        if self.price >= take_profit:
            self.liquidate()
```

### Pattern 4: Prediction Caching

Cache predictions to avoid redundant lookups:

```python
def __init__(self):
    super().__init__()
    self._cached_prediction = None
    self._cached_timestamp = 0

@property
def eth_prediction(self):
    # Only fetch new predictions every 5 minutes
    current_time = self.time
    if current_time - self._cached_timestamp >= 300000:  # 5 minutes in ms
        predictions = self.get_predictions('ETH-USDT', '8h', 'log_return')
        if predictions:
            self._cached_prediction = predictions[-1]['value']
            self._cached_timestamp = current_time

    return self._cached_prediction or 0
```

## Troubleshooting

### No Predictions Available

**Symptoms:** `get_predictions()` returns empty list

**Solutions:**
1. **Check Symbol Format**: Use `ETH-USDT` or `ETH-USDC`, not `ETH-USD` in strategy code
2. **Verify Network**: Ensure strategy network matches prediction topic network (mainnet/testnet)
3. **Check Topic Coverage**: Symbol may not have predictions for requested horizon
4. **Data Not Downloaded**: Initial download may take time, check Allora downloader cron job

### Stale Predictions

**Symptoms:** Same prediction value for extended period

**Solutions:**
1. **Check Prediction Timestamp**: Compare `prediction['timestamp']` to current time
2. **Network Issues**: Allora Network may be experiencing downtime
3. **Cron Job Status**: Verify AlloraDownloader is running and healthy
4. **Implement Staleness Check**:
   ```python
   def is_prediction_stale(self, prediction, max_age_minutes=30):
       age_ms = self.time - prediction['timestamp']
       return age_ms > (max_age_minutes * 60 * 1000)
   ```

### Inconsistent Backtest Results

**Symptoms:** Different results when running same backtest multiple times

**Solutions:**
1. **Use Exact Date Ranges**: Specify start and end dates explicitly
2. **Check Prediction Availability**: Ensure predictions exist for entire backtest period
3. **Verify Symbol Conversion**: Check that route symbols match prediction symbols
4. **Network Consistency**: Use same network (mainnet/testnet) for all runs

### Performance Issues

**Symptoms:** Slow backtest execution with Allora strategies

**Solutions:**
1. **Cache Predictions**: Store in instance variables to avoid repeated lookups
2. **Batch Loading**: Predictions are pre-loaded for backtest period (automatic)
3. **Reduce Lookups**: Only call `get_predictions()` when needed, not every candle
4. **Optimize Thresholds**: Fewer trades = faster execution

## Advanced Topics

### Prediction Horizon Selection

**5-Minute Predictions:**
- Suited for: High-frequency scalping, very short holds
- Considerations: Higher noise, requires tight stops
- Typical hold: 5-15 minutes

**8-Hour Predictions:**
- Suited for: Intraday swing trading, momentum strategies
- Considerations: Balanced noise/signal ratio
- Typical hold: 4-12 hours

**24-Hour Predictions:**
- Suited for: Daily swing trading, trend following
- Considerations: Smoother signals, lower frequency
- Typical hold: 12-48 hours

**1-Week Predictions:**
- Suited for: Position trading, long-term trends
- Considerations: Very low noise, rare signals
- Typical hold: 3-10 days

### Multi-Horizon Strategies

Combine predictions across multiple horizons:

```python
@property
def multi_horizon_signal(self):
    # Get predictions for different horizons
    pred_8h = self.get_predictions('ETH-USDT', '8h', 'log_return')
    pred_24h = self.get_predictions('ETH-USDT', '24h', 'log_return')

    if not pred_8h or not pred_24h:
        return 0

    val_8h = pred_8h[-1]['value']
    val_24h = pred_24h[-1]['value']

    # Strong signal when both horizons agree
    if val_8h > 0.01 and val_24h > 0.01:
        return 2    # Very bullish
    elif val_8h > 0.01 or val_24h > 0.01:
        return 1    # Moderately bullish
    elif val_8h < -0.01 and val_24h < -0.01:
        return -2   # Very bearish
    elif val_8h < -0.01 or val_24h < -0.01:
        return -1   # Moderately bearish
    return 0
```

### Prediction Confidence Metrics

While Allora doesn't provide explicit confidence scores, you can derive confidence from:

1. **Magnitude**: Larger absolute values suggest stronger conviction
2. **Consistency**: Compare prediction to recent price action
3. **Agreement**: Check if multiple horizons align
4. **Historical Accuracy**: Track prediction errors in your backtest

## Learn More

- **Allora Network Website**: [https://allora.network](https://allora.network)
- **Allora Documentation**: [https://docs.allora.network](https://docs.allora.network)
- **Inference Node Setup**: [https://docs.allora.network/inference](https://docs.allora.network/inference)
- **Allora Discord**: [https://discord.gg/allora](https://discord.gg/allora)

## Related Documentation

- [MCP Tools Reference](/guide/mcp-tools) - All available tools including `enhance_with_allora`
- [Chat Interface Guide](/guide/chat-interface) - Using Allora via chat
- [Strategy Creation](/guide/strategies) - Building custom strategies
- [Backtesting Guide](/guide/backtesting) - Testing Allora strategies

## Tips & Best Practices

**Start Simple:**
- Begin with pure Allora strategies to understand prediction behavior
- Add technical indicators gradually for confirmation
- Test on testnet before using mainnet predictions

**Cost Optimization:**
- Use `generate_ideas` ($0.05) before `enhance_with_allora` ($0.25-0.50)
- Testnet predictions are free for development
- Cache predictions to avoid redundant API calls

**Risk Management:**
- Don't rely solely on ML predictions - use stop losses
- Size positions based on prediction confidence
- Always implement fallback logic for missing predictions

**Performance Tuning:**
- Test multiple entry/exit thresholds (0.01, 0.015, 0.02)
- Experiment with different horizons for your trading style
- Compare ensemble vs pure Allora strategies
- Track prediction accuracy over time in your backtests

**Avoiding Overfitting:**
- Use walk-forward validation, not single backtest period
- Don't over-optimize prediction thresholds
- Test on multiple symbols and market conditions
- Reserve recent data for out-of-sample testing
