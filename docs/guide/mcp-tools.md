# MCP Tools Reference

This reference lists all available MCP tools in Robonet's MCP server. Each tool includes its name, description, primary use case, and pricing tier.

## Tool Categories

- [Data Access Tools](#data-access-tools) - Browse strategies, symbols, indicators, and backtest results
- [AI-Powered Strategy Tools](#ai-powered-strategy-tools) - Generate, optimize, and enhance strategies
- [Backtesting & Analysis](#backtesting-analysis) - Test and optimize strategy performance
- [Prediction Market Tools](#prediction-market-tools) - Build and test Polymarket strategies


## Data Access Tools

Fast, low-cost tools for browsing and retrieving data. Execution time: <1s.

### `get_all_strategies`

**Description:** Returns list of all your trading strategies with metadata.

**Primary Use Case:** Browse your strategy portfolio, see which strategies you've created.

**Parameters:**
- `include_latest_backtest` (optional, boolean): Include latest backtest results for each strategy

**Returns:** List of strategies with names, components (base name, symbol, timeframe, risk level), and optionally latest backtest summaries.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_all_strategies with include_latest_backtest=true to see all my strategies and their recent performance
```

---

### `get_strategy_code`

**Description:** Returns Python source code for a specified trading strategy.

**Primary Use Case:** View or analyze the implementation of an existing strategy.

**Parameters:**
- `strategy_name` (required, string): Name of the strategy to retrieve

**Returns:** Python source code of the strategy file.

**Pricing:** Tier 2 - Code Access ($0.10, premium IP pricing)

**Example Usage:**
```
Use get_strategy_code with strategy_name="MomentumBreakout_h" to see the implementation
```

---

### `get_strategy_versions`

**Description:** Returns version history and metadata for a strategy lineage.

**Primary Use Case:** Track evolution of a strategy across versions (base → optimized → Allora-enhanced).

**Parameters:**
- `base_strategy_name` (required, string): Base name of the strategy (without version suffixes)

**Returns:** List of all versions with creation dates and modification history.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_strategy_versions with base_strategy_name="MomentumBreakout" to see all versions
```

---

### `get_all_symbols`

**Description:** Returns list of tracked trading symbols from Hyperliquid Perpetual.

**Primary Use Case:** Discover which trading pairs are available for backtesting and live trading.

**Parameters:**
- `exchange` (optional, string): Filter by exchange name (default: all)
- `active_only` (optional, boolean): Only return active symbols (default: true)

**Returns:** List of symbols with exchange, symbol name, active status, and backfill status.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_all_symbols with active_only=true to see which pairs I can trade
```

---

### `get_all_technical_indicators`

**Description:** Returns list of 200+ technical indicators available in Jesse framework.

**Primary Use Case:** Discover which indicators you can use in your strategies (RSI, MACD, Bollinger Bands, etc.).

**Parameters:** None

**Returns:** List of all available indicators with names and categories.

**Pricing:** Free

**Example Usage:**
```
Use get_all_technical_indicators to see what indicators are available
```

---

### `get_allora_topics`

**Description:** Returns list of Allora Network price prediction topics with metadata.

**Primary Use Case:** Discover which assets have ML prediction data available for strategy enhancement.

**Parameters:** None

**Returns:** List of topics with asset names, network IDs, and prediction horizons.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_allora_topics to see which assets have ML predictions available
```

---

### `get_latest_backtest_results`

**Description:** Returns the most recent backtest results for a strategy.

**Primary Use Case:** Quickly check strategy performance without running a new backtest.

**Parameters:**
- `strategy_name` (required, string): Name of the strategy

**Returns:** Full backtest metrics including profit, drawdown, Sharpe ratio, trade statistics, and equity curve.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_latest_backtest_results with strategy_name="MomentumBreakout_h" to see recent performance
```

---

## AI-Powered Strategy Tools

Tools that use AI agents to generate, optimize, and enhance trading strategies. Execution time: 20-60s.

### `create_strategy`

**Description:** Generate complete trading strategy code with AI based on your requirements.

**Primary Use Case:** Create a new strategy from scratch by describing your trading logic in natural language.

**Parameters:**
- `strategy_name` (required, string): Name for the new strategy (e.g., "MomentumBreakout")
- `description` (required, string): Detailed requirements including entry/exit logic, risk management, indicators

**Returns:** Complete Python strategy code implementing your requirements with entry/exit logic, position sizing, and risk management.

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $4.50)

**Execution Time:** ~30-60s

**Example Usage:**
```
Use create_strategy to build a momentum strategy that:
- Enters long when RSI crosses above 30 and price breaks above 20-day MA
- Exits when RSI crosses below 70 or 3% stop loss is hit
- Uses 2% position sizing with 3x leverage
- Targets BTC-USDT on 1h timeframe
```

---

### `generate_ideas`

**Description:** Creates innovative strategy concepts based on current Hyperliquid market data.

**Primary Use Case:** Get AI-generated strategy ideas when you're not sure what to build.

**Parameters:**
- `strategy_count` (optional, integer, 1-10): Number of strategy ideas to generate (default: 1)

**Returns:** List of strategy concepts with descriptions of market conditions, logic, and rationale.

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $1.00)

**Execution Time:** ~20-40s

**Example Usage:**
```
Use generate_ideas with strategy_count=3 to get three innovative strategy concepts
```

---

### `optimize_strategy`

**Description:** Analyzes and improves strategy parameters using backtesting data and AI.

**Primary Use Case:** Tune indicator thresholds, risk settings, and entry/exit conditions for better performance.

**Parameters:**
- `strategy_name` (required, string): Name of the strategy to optimize
- `start_date` (required, string): Start date in YYYY-MM-DD format
- `end_date` (required, string): End date in YYYY-MM-DD format
- `symbol` (required, string): Trading pair (e.g., "BTC-USDT")
- `timeframe` (required, string): Timeframe (1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 8h, 12h, 1d)

**Returns:** Optimized strategy version with improved parameters and performance comparison.

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $4.00)

**Execution Time:** ~30-60s

**Example Usage:**
```
Use optimize_strategy on "MomentumBreakout_h" for BTC-USDT 1h from 2024-01-01 to 2024-06-30
```

---

### `enhance_with_allora`

**Description:** Adds machine learning price predictions from Allora Network to strategy logic.

**Primary Use Case:** Improve strategy performance by incorporating ML-based price forecasts as additional signals.

**Parameters:**
- `strategy_name` (required, string): Name of the strategy to enhance
- `symbol` (required, string): Trading pair (e.g., "BTC-USDT")
- `timeframe` (required, string): Timeframe
- `start_date` (required, string): Start date for comparison backtest
- `end_date` (required, string): End date for comparison backtest

**Returns:** Enhanced strategy version with ML signals integrated, plus before/after performance comparison.

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $2.50)

**Execution Time:** ~30-60s

**Example Usage:**
```
Use enhance_with_allora on "MomentumBreakout_h" for ETH-USDT 4h from 2024-01-01 to 2024-06-30
```

---

### `refine_strategy`

**Description:** Apply iterative refinements to existing strategies with AI code editing.

**Primary Use Case:** Make targeted improvements or bug fixes to existing strategy code.

**Parameters:**
- `strategy_name` (required, string): Strategy to refine (any version)
- `changes_description` (required, string): What changes you want to make
- `mode` (required, string): "new" (create new version) or "replace" (overwrite existing)

**Returns:** Refined strategy code with automatic validation and safety checks.

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $3.00)

**Execution Time:** ~20-30s

**Example Usage:**
```
Use refine_strategy on "MomentumBreakout_h" to tighten stop loss from 3% to 2% and add trailing stop, mode="new"
```

---

## Backtesting & Analysis

Compute-intensive tools for testing strategy performance on historical data. Execution time: 20-40s.

### `run_backtest`

**Description:** Test strategy performance on historical data with comprehensive metrics.

**Primary Use Case:** Validate strategy logic and measure performance before live deployment.

**Parameters:**
- `strategy_name` (required, string): Name of the strategy to test
- `start_date` (required, string): Start date in YYYY-MM-DD format
- `end_date` (required, string): End date in YYYY-MM-DD format
- `symbol` (required, string): Trading pair (e.g., "BTC-USDT")
- `timeframe` (required, string): Timeframe (1m, 3m, 5m, 15m, 30m, 45m, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 1D, 3D, 1W, 1M)
- `config` (optional, object): Backtest configuration (fee, slippage, leverage, etc.)

**Returns:** Comprehensive metrics including:
- Performance: net_profit, total_return, annual_return, Sharpe ratio, Sortino ratio
- Risk: max_drawdown, Calmar ratio, win_rate, profit_factor
- Trade stats: total/winning/losing trades, streaks, average win/loss
- Equity curve (downsampled to 200 points for visualization)

**Pricing:** Tier 3 - Compute ($0.001)

**Execution Time:** ~20-40s

**Example Usage:**
```
Use run_backtest on "MomentumBreakout_h" for BTC-USDT 1h from 2024-01-01 to 2024-12-31
```

---

## Prediction Market Tools

Specialized tools for building and testing Polymarket prediction market strategies. Execution time varies.

### `create_prediction_market_strategy`

**Description:** Generate Polymarket strategy code with YES/NO token trading logic.

**Primary Use Case:** Build strategies that trade on prediction market outcomes (e.g., election results, crypto prices).

**Parameters:**
- `strategy_name` (required, string): Name for the strategy (e.g., "ValueBuyer")
- `description` (required, string): Detailed requirements for YES/NO token logic and thresholds

**Returns:** Complete PolymarketStrategy code with should_buy_yes(), should_buy_no(), go_yes(), go_no() methods.

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $4.50)

**Execution Time:** ~30-60s

**Example Usage:**
```
Use create_prediction_market_strategy to build a "PriceThreshold" strategy that:
- Buys YES tokens when price < 0.40 (undervalued)
- Buys NO tokens when price > 0.60 (overvalued)
- Exits positions when price returns to 0.45-0.55 range
```

---

### `get_all_prediction_events`

**Description:** Returns list of available Polymarket prediction events with metadata.

**Primary Use Case:** Browse prediction markets to find trading opportunities.

**Parameters:**
- `market_status` (optional, string): Filter by status ("PENDING" or "RESOLVED")
- `limit` (optional, integer): Maximum number of events to return

**Returns:** List of prediction events with titles, descriptions, YES/NO token prices, resolution status, and volume data.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_all_prediction_events with market_status="PENDING" to see active markets
```

---

### `get_prediction_market_data`

**Description:** Returns detailed timeseries data for a specific prediction market.

**Primary Use Case:** Analyze price history and trading patterns for a prediction market.

**Parameters:**
- `event_id` (required, string): Polymarket event ID
- `start_date` (optional, string): Start date for timeseries data
- `end_date` (optional, string): End date for timeseries data

**Returns:** YES/NO token price timeseries, volume data, and market metadata.

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_prediction_market_data with event_id="0x123abc..." to analyze market history
```

---

### `run_prediction_market_backtest`

**Description:** Test prediction market strategy performance on historical market data.

**Primary Use Case:** Validate Polymarket strategy logic before live trading.

**Parameters:**
- `strategy_name` (required, string): Name of the PolymarketStrategy
- `event_id` (required, string): Polymarket event ID to test on
- `start_date` (required, string): Start date in YYYY-MM-DD format
- `end_date` (required, string): End date in YYYY-MM-DD format
- `config` (optional, object): Backtest configuration

**Returns:** Backtest metrics including profit/loss, win rate, and position history for YES/NO tokens.

**Pricing:** Tier 3 - Compute ($0.001)

**Execution Time:** ~20-40s

**Example Usage:**
```
Use run_prediction_market_backtest on "PriceThreshold" for event "0x123abc..." from 2024-06-01 to 2024-12-01
```

---

## Pricing Tiers

Robonet uses a credit-based billing system with different pricing models:

- **Tier 1 - Data Access:** $0.001 fixed cost for database queries
- **Tier 2 - Code Access:** $0.10 fixed cost for strategy code retrieval (premium IP)
- **Tier 3 - Compute:** $0.001 fixed cost for backtesting and optimization
- **Tier 4 - AI Generation:** Real LLM cost + margin (billed after execution)
  - Uses actual Claude API costs plus platform margin
  - Maximum price caps listed per tool
  - Typical costs range from $0.50-$3.00 depending on complexity

**Free Tools:**
- `get_all_technical_indicators`

**Note:** Credits are reserved before tool execution and confirmed/cancelled after completion. Failed operations may incur partial costs for compute time used.

---

## Common Workflows

### 1. Create and Test a New Strategy

```
1. generate_ideas (strategy_count=3) → Pick an idea
2. create_strategy (name + description) → Generate code
3. run_backtest (6 month period) → Test performance
4. If good: optimize_strategy → Tune parameters
5. If great: enhance_with_allora → Add ML signals
6. Final: run_backtest → Confirm improvements
```

### 2. Browse and Improve Existing Strategy

```
1. get_all_strategies (include_latest_backtest=true) → See portfolio
2. get_strategy_code (strategy_name) → Review implementation
3. refine_strategy (targeted changes, mode="new") → Make improvements
4. run_backtest → Validate changes
```

### 3. Explore Market Opportunities

```
1. get_all_symbols (active_only=true) → See available pairs
2. get_allora_topics → Check ML prediction availability
3. create_strategy → Build for chosen asset
4. enhance_with_allora → Add ML signals from start
```

### 4. Prediction Market Trading

```
1. get_all_prediction_events (market_status="PENDING") → Find markets
2. get_prediction_market_data (event_id) → Analyze market
3. create_prediction_market_strategy → Build YES/NO logic
4. run_prediction_market_backtest → Test on historical data
```

---

## Tool Execution Times

- **<1s:** All Data Access tools (`get_*` tools except AI tools)
- **~20-30s:** Fast AI tools (`refine_strategy`, `generate_ideas`)
- **~20-40s:** Backtesting tools (`run_backtest`, `run_prediction_market_backtest`)
- **~30-60s:** AI strategy generation/optimization (`create_strategy`, `optimize_strategy`, `enhance_with_allora`, `create_prediction_market_strategy`)

---

## Tips for Efficient Tool Usage

1. **Start with Data Tools:** Use `get_all_strategies`, `get_all_symbols`, `get_allora_topics` to understand what's available before generating new strategies.

2. **Cost Management:** AI tools (`create_strategy`, `optimize_strategy`, `enhance_with_allora`) use real LLM costs. Use `generate_ideas` first (cheaper) to explore concepts before committing to full implementation.

3. **Iterative Development:** Use `refine_strategy` for targeted changes instead of regenerating from scratch with `create_strategy`.

4. **Backtest Early:** Always `run_backtest` before `optimize_strategy` to ensure basic logic works.

5. **Version Management:** Use `get_strategy_versions` to track evolution and use `mode="new"` in `refine_strategy` to preserve working versions.

6. **Prediction Markets:** Check `get_all_prediction_events` regularly for new trading opportunities, and use `get_prediction_market_data` to analyze market dynamics before building strategies.

---

## Security & Access Control

All MCP tools enforce wallet-based access control:

- **Strategy Ownership:** Only the creating wallet can access, modify, or backtest a strategy
- **API Authentication:** All tools require valid API key (JWT token) from Robonet backend
- **Credit Reservation:** Credits are reserved atomically before execution to prevent TOCTOU issues
- **Input Validation:** All parameters are validated and sanitized to prevent injection attacks

See [MCP Server Setup](/guide/mcp-server) for authentication configuration.
