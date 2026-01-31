# Strategy Optimization

Learn how to improve your trading strategy performance by automatically finding optimal parameter values.

## What is Strategy Optimization?

**Strategy optimization** is the process of automatically testing different parameter combinations to find the configuration that produces the best historical performance. Instead of manually guessing which values work best (e.g., "Should my RSI threshold be 30 or 35?"), the optimizer tests hundreds or thousands of combinations and identifies the top performers.

**Example scenario:**
```
Your strategy has:
- RSI threshold (could be 20-80)
- Stop loss percentage (could be 1-10%)
- Take profit multiplier (could be 1.5-5.0)

Manual testing: Try 5 combinations → Takes hours
Optimizer: Tests 1,200+ combinations → Takes 30-60 seconds
```

::: tip For Non-Technical Users
You don't need to configure optimization yourself. Simply say in the chat: "Optimize this strategy on BTC-USDC for the last 6 months" and Robonet will automatically find better parameter values, create an improved version, and show you the performance difference.
:::

## What Gets Optimized?

### Hyperparameters

Optimization adjusts **hyperparameters**—the tunable settings that control strategy behavior. Common examples:

| Parameter Type | Examples | Impact |
|---------------|----------|--------|
| **Entry thresholds** | RSI < 30, MACD crossover angle, Volume spike level | When to enter trades |
| **Exit thresholds** | Take profit %, Stop loss %, Trailing stop distance | When to exit trades |
| **Indicator settings** | Moving average periods, Bollinger Band width, ATR multiplier | How indicators calculate signals |
| **Risk controls** | Position size %, Max drawdown limit, Min candles between trades | How much to risk |

**What does NOT get optimized:**
- Core strategy logic (e.g., "buy on RSI oversold" vs "buy on breakout")
- Which indicators to use (optimizer doesn't add/remove indicators)
- Trading venue or symbol (you specify these)
- Timeframe (you choose this)

::: warning Strategy Logic vs Parameters
Optimization **tunes existing parameters**, it doesn't redesign your strategy. If the core logic is flawed (e.g., a trend-following strategy in a ranging market), optimization can't fix it. Think of it like tuning a guitar—it makes a good instrument sound better, but can't turn a broken one into a working one.
:::

## How Optimization Works

### The Process (Conceptually)

1. **Define search space**: For each hyperparameter, specify min/max range (e.g., RSI threshold: 20-80)
2. **Generate candidates**: Optimizer intelligently proposes parameter combinations to test
3. **Evaluate fitness**: Each combination is backtested, scored by a metric (Sharpe ratio, Calmar, etc.)
4. **Learn and adapt**: Algorithm learns which parameter regions work better, focuses search there
5. **Return best results**: After 1,200+ trials, optimizer reports top 20 configurations

**Algorithm used:**
- **Optuna with Bayesian optimization**: Intelligently explores parameter space (not random guessing or exhaustive grid search)
- **Ray distributed execution**: Runs trials in parallel across CPU cores for speed
- **Two-phase validation**: Training phase (finds best params) + Testing phase (validates on unseen data)

### Fitness Scoring

The optimizer ranks parameter combinations using a **fitness score**:

```
Fitness = total_effect_rate × ratio_normalized

Where:
- total_effect_rate = logarithmic scaling of trade count (rewards strategies with enough trades)
- ratio_normalized = normalized objective metric (e.g., Sharpe ratio, scaled 0-1)
```

**Requirements for valid trial:**
- Must generate ≥5 trades on training data (fewer = rejected as invalid)
- Objective metric must be positive (negative Sharpe ratio = rejected)
- No NaN or infinite values in results

**Common objective metrics:**
- **Sharpe ratio** (default): Risk-adjusted returns
- **Calmar ratio**: Annual return ÷ Max drawdown
- **Sortino ratio**: Like Sharpe but focuses on downside volatility
- **Profit factor**: Gross profit ÷ Gross loss

## Running an Optimization

### Via Chat Interface

1. **Create or select a strategy** you want to optimize
2. **Request optimization**: "Optimize this strategy on BTC-USDC for the last 6 months"
3. **Review the results**: The interface shows:
   - **Performance comparison**: Before vs After metrics
   - **Improved metrics**: New Sharpe ratio, max drawdown, win rate
   - **Parameter changes**: Which values changed and why
   - **New strategy created**: `{StrategyName}_optimized/` with improved code

**Example prompts:**
```
"Optimize MomentumStrategy for ETH-USDC from 2024-01-01 to 2024-06-30"
"Find better parameters for this strategy on SOL-USDC"
"Improve the Sharpe ratio for my breakout strategy"
```

**Screenshot placeholder:** Chat interface showing optimization request with results card comparing original vs optimized performance metrics.

### Via MCP Server

Use the `optimize_strategy` tool from your coding agent:

```
Optimize MomentumStrategy on BTC-USDC from 2024-01-01 to 2024-06-30
```

The MCP tool will:
1. Analyze baseline performance
2. Diagnose 1-2 specific issues (e.g., "Stop loss too tight", "Entry threshold too conservative")
3. Propose targeted fixes with rationale
4. Create `{StrategyName}_optimized/` folder with improved code
5. Return JSON summary with before/after comparison

See the [MCP Tools Reference](/guide/mcp-tools#optimize-strategy) for detailed parameters.

## Available Parameters

### Required Parameters

| Parameter | Description | Format | Example |
|-----------|-------------|--------|---------|
| **strategy_name** | Name of strategy to optimize | String (alphanumeric, _, -) | `MomentumStrategy` |
| **symbol** | Trading pair for optimization | BASE-QUOTE | `BTC-USDC`, `ETH-USDC` |
| **start_date** | Training period start | YYYY-MM-DD | `2024-01-01` |
| **end_date** | Training period end | YYYY-MM-DD | `2024-06-30` |
| **timeframe** | Candle size | 1m, 5m, 15m, 30m, 1h, 4h, 1D, etc. | `4h`, `1D` |

### Strategy-Specific Hyperparameters

Each strategy defines which parameters can be optimized. Example from `KamaTrendFollowing`:

```python
Hyperparameters:
- adx_threshold: 20.0 to 80.0 (default: 50.0)
- chop_threshold: 30.0 to 70.0 (default: 50.0)
- bb_width_threshold: 3.0 to 15.0 (default: 7.0)
- atr_multiplier: 1.0 to 5.0 (default: 2.5)
- risk_percentage: 0.5 to 10.0 (default: 3.0)
- min_candles_between_trades: 1 to 50 (default: 10)
```

**Hyperparameter types supported:**
- **Float**: Continuous values (e.g., 1.5, 2.73, 4.99)
- **Integer**: Whole numbers (e.g., 10, 25, 50)
- **Categorical**: Discrete choices (e.g., ["SMA", "EMA", "WMA"])

::: tip Viewing Strategy Hyperparameters
To see which parameters your strategy can optimize, ask in chat: "What parameters can I optimize for this strategy?" The response will list all tunable hyperparameters with their ranges.
:::

## Reviewing Optimization Results

### Performance Comparison

After optimization completes, you'll see a before/after comparison:

**Example: Successful Optimization**

```
Original Performance:
- Total Return: +18.2%
- Sharpe Ratio: 1.2
- Max Drawdown: -22.5%
- Win Rate: 48%
- Total Trades: 42

Optimized Performance:
- Total Return: +28.7% (+10.5% improvement)
- Sharpe Ratio: 1.9 (+0.7 improvement)
- Max Drawdown: -14.3% (8.2% less risky)
- Win Rate: 54% (+6% improvement)
- Total Trades: 51

Key Changes:
- RSI threshold: 30 → 35 (reduced false signals)
- Stop loss: 5% → 3.5% (tighter risk control)
- Take profit multiplier: 2.0 → 2.8 (let winners run longer)
```

**What to look for:**
- **Sharpe ratio improvement**: Most important metric (risk-adjusted returns)
- **Reduced drawdown**: Lower peak-to-trough losses
- **Maintained/increased trade count**: Still has statistical significance (30+ trades)
- **Realistic win rate**: 45-65% typical (not >75% which indicates overfitting)

### Top Candidates Table

When using the optimization dashboard, you'll see the top 20 parameter combinations ranked by fitness:

| Rank | Trial | Hyperparameters | Fitness | Training Sharpe | Testing Sharpe |
|------|-------|-----------------|---------|----------------|----------------|
| 1 | 847 | RSI=35, SL=3.5%, TP=2.8x | 0.842 | 1.92 | 1.85 |
| 2 | 1203 | RSI=33, SL=3.8%, TP=2.6x | 0.839 | 1.88 | 1.87 |
| 3 | 562 | RSI=37, SL=3.2%, TP=2.9x | 0.831 | 1.95 | 1.79 |

**How to interpret:**
- **Rank 1 = best overall** based on fitness score (balances training + testing)
- **Fitness score**: Higher = better (range 0-1, encoded as base64 "DNA" in some views)
- **Training vs Testing Sharpe**: Should be similar—large gap indicates overfitting
- **Hyperparameter patterns**: Notice which values cluster at the top (e.g., RSI 33-37 range)

### Objective Curve

The optimization dashboard displays a **learning curve** showing how the algorithm improves over time:

```
Y-axis: Sharpe Ratio
X-axis: Trial Number

Training curve (blue): Performance on training data
Testing curve (orange): Performance on validation data

Expected pattern:
- Early trials: Wide variation (exploring)
- Later trials: Converging on optimal region (exploiting)
- Testing curve: Should track training curve closely (not diverge)
```

**Red flags:**
- Testing curve far below training curve = overfitting
- No improvement after 500+ trials = poor strategy logic, optimization can't help
- Very high training scores (>3.0 Sharpe) with low testing = overfitted to training data

## Best Practices

### 1. Start with Solid Strategy Logic

**Optimization amplifies existing logic, it doesn't fix broken strategies.**

**Bad:** Create random strategy → Optimize → Hope it works
**Good:** Design logical strategy → Backtest → Optimize parameters → Validate

**Signs your strategy needs redesign (not optimization):**
- Generates <5 trades in 6 months (too conservative)
- Win rate <35% (fundamental logic issue)
- Negative returns even after optimization (strategy doesn't fit market)

### 2. Use Realistic Training Periods

**Optimization period should match your intended deployment timeframe:**

| Deployment Plan | Recommended Training Period |
|----------------|----------------------------|
| Short-term (1-3 months) | 6-12 months historical data |
| Medium-term (3-6 months) | 12-18 months historical data |
| Long-term (6+ months) | 18-24+ months historical data |

::: warning Don't Train on Too Little Data
Training on <3 months risks overfitting to specific market conditions. You might optimize for a bull run that doesn't repeat, or a volatility spike that was temporary. **Use at least 6 months of data** for meaningful optimization.
:::

### 3. Validate on Out-of-Sample Data

**Critical step: Test optimized strategy on different time period**

```
1. Optimize on Period A: 2023-01-01 to 2023-12-31
2. Validate on Period B: 2024-01-01 to 2024-06-30 (don't re-optimize)
3. Compare performance:
   - Similar results = Robust optimization
   - Dramatically worse = Overfitted to Period A
```

**Example: Good validation**
```
Training (2023): Sharpe 1.9, Return +28%
Validation (2024): Sharpe 1.7, Return +24%
→ Consistent performance, safe to deploy
```

**Example: Overfitting detected**
```
Training (2023): Sharpe 2.8, Return +45%, Win rate 82%
Validation (2024): Sharpe 0.4, Return +3%, Win rate 43%
→ Overfitted, DO NOT deploy, redesign strategy
```

### 4. Multi-Symbol Validation

**Test optimized parameters on different assets:**

```
Optimize on BTC-USDC → Test on ETH-USDC and SOL-USDC

If performance is similar across symbols:
→ Strategy logic is robust

If performance collapses on other symbols:
→ Overfit to BTC-specific patterns
```

### 5. Keep Strategies Simple

**Simple strategies optimize better and are more robust:**

- **3-5 hyperparameters**: RSI threshold, stop loss, take profit, position size
- **6-10 hyperparameters**: Getting complex, higher overfitting risk
- **10+ hyperparameters**: Very high overfitting risk, difficult to interpret

**Why complexity hurts:**
- More parameters = larger search space = harder to find true optimum
- More parameters = more ways to overfit to training data
- Complex strategies often underperform simple ones in live trading

### 6. Compare to Baseline

**Always backtest the optimized strategy and compare to original:**

```
Original:   Sharpe 1.2, Drawdown -22%, Win Rate 48%
Optimized:  Sharpe 1.9, Drawdown -14%, Win Rate 54%

Improvement: +58% Sharpe, 36% less risky → Good optimization
```

**If improvement is minimal (<10% Sharpe gain):**
- Original parameters were already near-optimal
- Strategy has limited room for improvement
- Consider trying different strategy logic instead

### 7. Monitor Live Performance

**Optimization guarantees nothing about future performance:**

1. **Start small**: Deploy with 10-20% of intended capital
2. **Set stop-loss**: Kill strategy if drawdown exceeds expectations
3. **Track metrics**: Compare live Sharpe ratio to backtest expectations
4. **Reassess monthly**: If performance degrades, pause and re-optimize on recent data

## Common Pitfalls

### Overfitting (Most Common)

**What it is:** Finding parameters that work perfectly on historical data but fail in live trading because they're too specifically tuned to past patterns.

**Signs of overfitting:**
- Win rate >75% (unrealistically high)
- Testing performance << Training performance (large gap)
- <20 trades per year (not statistically significant)
- Performance collapses on out-of-sample validation
- 10+ hyperparameters being optimized simultaneously

**How to avoid:**
1. Use two-phase validation (training + testing on separate data)
2. Demand consistency across multiple time periods
3. Keep strategies simple (≤5 hyperparameters)
4. Require ≥50 trades per year for statistical validity
5. Test on multiple symbols before deploying

### Insufficient Training Data

**Problem:** Optimizing on 1-2 months captures temporary market conditions, not robust patterns.

**Solution:** Use ≥6 months for optimization, ideally 12+ months covering different market regimes (bull, bear, ranging).

### Ignoring Transaction Costs

**Problem:** Optimizer finds high-frequency parameters that look profitable but get destroyed by fees.

**Solution:** Always optimize with realistic fees (0.04% for Hyperliquid) and slippage (0.1%+). Robonet uses these by default.

### One-Time Optimization Only

**Problem:** Markets evolve. Parameters optimized on 2023 data may not work in 2024.

**Solution:** Re-optimize quarterly or when performance degrades. Track regime changes (volatility, trending vs ranging).

### Chasing Perfect Parameters

**Problem:** Spending hours tweaking optimization to get Sharpe from 1.8 to 1.85.

**Reality:** Diminishing returns. Time better spent testing multiple strategy concepts.

**Solution:** If optimization improves Sharpe by >20% and metrics look healthy → deploy. Don't chase perfection.

## Optimization Cost & Time

### Pricing

- **MCP Tool Cost**: $0.50 per optimization (Tier 4 - AI Generation)
- **Execution Time**: ~30-60 seconds per optimization
- **What's included**:
  - AI analysis of baseline performance
  - Intelligent parameter search (1,200+ trials in backend)
  - Diagnostic report of issues + applied fixes
  - New optimized strategy code
  - Before/after comparison

See [Billing & Credits](/guide/billing) for more details.

### When to Optimize

**Optimize when:**
- Strategy works but performance could be better
- You're testing on new symbols/timeframes
- Market conditions have changed (re-optimize quarterly)
- After making logic changes to an existing strategy

**Don't optimize when:**
- Strategy generates <5 trades (fix logic first)
- Core strategy logic is broken (redesign instead)
- You haven't backtested original version yet (validate first)
- Chasing tiny improvements (1.8 → 1.85 Sharpe not worth effort)

## Example Workflow

### Complete Optimization Pipeline

```
Step 1: Design Strategy
→ "Create a momentum strategy using RSI and MACD"

Step 2: Initial Backtest (Baseline)
→ "Backtest MomentumStrategy on BTC-USDC for last 12 months"
→ Result: Sharpe 1.2, Return +18%, Drawdown -22%

Step 3: Optimize Parameters
→ "Optimize MomentumStrategy for better risk-adjusted returns"
→ Result: Sharpe 1.9 (+58% improvement), Return +28%, Drawdown -14%

Step 4: Out-of-Sample Validation
→ "Backtest MomentumStrategy_optimized on BTC-USDC from 2024-01-01 to now"
→ Result: Sharpe 1.7 (consistent with training), safe to proceed

Step 5: Multi-Symbol Validation
→ "Backtest MomentumStrategy_optimized on ETH-USDC and SOL-USDC"
→ Result: ETH Sharpe 1.6, SOL Sharpe 1.8 (robust across symbols)

Step 6: Deploy with Safeguards
→ Deploy 10% capital, -15% stop-loss, monitor for 1 month
→ After 1 month: Live Sharpe 1.5 (within expectations), scale to 50% capital
```

## Technical Details (Advanced)

### Under the Hood

**Optimization Engine:**
- **Library**: Optuna (Bayesian hyperparameter optimization)
- **Parallelization**: Ray distributed execution (1 CPU core per trial)
- **Trial count**: `n_trials = len(hyperparameters) × 200` (e.g., 6 params = 1,200 trials)
- **Session storage**: SQLite database at `./storage/temp/optuna/optuna_study.db`
- **Resume capability**: Can resume interrupted optimizations from database

**Two-Phase Validation:**
1. **Training phase**: Find fitness score (used for ranking)
2. **Testing phase**: Validate on holdout data (detects overfitting)

**Python version requirement:** Ray doesn't support Python 3.13, requires 3.12 or lower.

### Hyperparameter Definition Format

Strategies define optimizable parameters via `hyperparameters()` method:

```python
def hyperparameters(self):
    return [
        {
            'name': 'rsi_threshold',
            'type': float,
            'min': 20.0,
            'max': 80.0,
            'default': 30.0
        },
        {
            'name': 'stop_loss_pct',
            'type': float,
            'min': 1.0,
            'max': 10.0,
            'default': 5.0,
            'step': 0.5  # Optional: discrete steps
        },
        {
            'name': 'moving_average_type',
            'type': categorical,
            'options': ['SMA', 'EMA', 'WMA'],
            'default': 'SMA'
        }
    ]
```

Strategies access optimized values via `self.hp['param_name']` in their code.

## Getting Help

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| **"No improvement after optimization"** | Original parameters already near-optimal, or strategy logic is flawed. Consider redesigning strategy instead of re-optimizing. |
| **"Testing performance much worse than training"** | Overfitting detected. Use longer training period (12+ months), reduce hyperparameter count, or simplify strategy logic. |
| **"Too few trades (<5) during optimization"** | Trials rejected as invalid. Relax entry conditions, test longer period, or use smaller timeframe. |
| **"Optimization takes too long (>2 min)"** | Likely using 1m timeframe on 2+ years of data. Use larger timeframe (4h, 1D) or shorter date range. |

### Tips for Better Optimizations

1. **Optimize on 6-12 months**, not 1-2 months (avoid fitting to temporary conditions)
2. **Always validate out-of-sample** (test on different period after optimizing)
3. **Focus on Sharpe ratio** (risk-adjusted returns matter more than absolute returns)
4. **Keep hyperparameters simple** (≤5 parameters for robust results)
5. **Test on multiple symbols** (validates strategy robustness)
6. **Re-optimize quarterly** (markets evolve, parameters should too)

### Requesting Help

If you're unsure about optimization results, ask in the chat:

```
"Is this optimization overfitted?"
"Why did my testing performance drop so much?"
"Should I deploy this optimized strategy?"
"Compare the optimized version to the original"
```

The AI assistant will analyze your metrics and provide guidance.

## Next Steps

- **Backtest your optimized strategy**: See [Backtesting Guide](/guide/backtesting) to validate performance
- **Enhance with ML predictions**: Learn about [Allora Integration](/guide/allora) for AI-powered signals
- **Deploy to live trading**: Ready to go live? See [Deployment Guide](/guide/deployment)
- **MCP Tools Reference**: Full technical details at [MCP Tools - optimize_strategy](/guide/mcp-tools#optimize-strategy)

## Learn More

- [Jesse Framework Optimization](https://docs.jesse.trade/docs/optimize.html) - The engine powering Robonet optimization
- [Optuna Documentation](https://optuna.readthedocs.io/) - Hyperparameter optimization framework
- [Backtesting Guide](/guide/backtesting) - Validate before and after optimization
- [Chat Interface Guide](/guide/chat-interface) - Run optimizations conversationally
- [MCP Server Setup](/guide/mcp-server) - Programmatic optimization via MCP tools
