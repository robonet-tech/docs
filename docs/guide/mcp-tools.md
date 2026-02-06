# MCP Tools Reference

This reference lists all 24 available MCP tools in Robonet's MCP server. Each tool includes its name, description, primary use case, and pricing tier.

## Tool Categories

- [Data Access Tools](#data-access-tools) - Browse strategies, symbols, indicators, data availability, and backtest results
- [AI-Powered Strategy Tools](#ai-powered-strategy-tools) - Generate, optimize, and enhance strategies
- [Backtesting & Analysis](#backtesting-analysis) - Test strategy performance on historical data
- [Prediction Market Tools](#prediction-market-tools) - Build and test Polymarket strategies
- [Deployment Tools](#deployment-tools) - Deploy and manage live trading agents
- [Account Tools](#account-tools) - Manage credits and account information


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

**Pricing:** Free

**Example Usage:**
```
Use get_strategy_code with strategy_name="MomentumBreakout_M" to see the implementation
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

**Description:** Returns list of 170+ technical indicators available in Jesse framework.

**Primary Use Case:** Discover which indicators you can use in your strategies (RSI, MACD, Bollinger Bands, etc.).

**Parameters:**
- `category` (optional, string): Filter by category - `momentum`, `trend`, `volatility`, `volume`, `overlap`, `oscillators`, `cycle`, or `all` (default: all)

**Returns:** List of indicators with names, categories, and parameters.

**Pricing:** $0.001

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

### `get_data_availability`

**Description:** Check available data ranges for crypto symbols and Polymarket prediction markets.

**Primary Use Case:** Verify data exists before running backtests to avoid failures due to missing data.

**Parameters:**
- `data_type` (optional, string): Type of data to check - `crypto`, `polymarket`, or `all` (default: all)
- `symbols` (optional, array): Specific crypto symbols to check (e.g., `["BTC-USDT", "ETH-USDT"]`)
- `exchange` (optional, string): Filter crypto by exchange (e.g., "Binance Perpetual Futures")
- `asset` (optional, string): Filter Polymarket by asset (e.g., "BTC", "ETH")
- `include_resolved` (optional, boolean): Include resolved Polymarket markets (default: true)
- `only_with_data` (optional, boolean): Only show items with available data (default: true)

**Returns:** Data availability including:
- Symbol/market identification
- Available date ranges (start/end dates)
- Candle counts
- Backfill status

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Check data availability for BTC-USDT to see the valid date range before backtesting
```

---

### `get_latest_backtest_results`

**Description:** Returns recent backtest results from the database with performance metrics.

**Primary Use Case:** Quickly check strategy performance without running a new backtest.

**Parameters:**
- `strategy_name` (optional, string): Filter by strategy name
- `limit` (optional, integer, 1-100): Number of results to return (default: 10)
- `include_equity_curve` (optional, boolean): Include equity curve timeseries data (default: false)
- `equity_curve_max_points` (optional, integer, 50-1000): Maximum points for equity curve if included (default: 200)

**Returns:** List of backtest records with metrics including profit, drawdown, Sharpe ratio, trade statistics, and optionally equity curve.

**Pricing:** Free

**Example Usage:**
```
Use get_latest_backtest_results with strategy_name="MomentumBreakout_M" and limit=5 to see recent performance
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

**Pricing:** Tier 4 - AI Generation (Real LLM cost + margin, max $3.00)

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

**Description:** Test strategy performance on historical data.

**Primary Use Case:** Validate strategy logic and measure performance before live deployment.

**Parameters:**
- `strategy_name` (required, string): Name of the strategy to test
- `start_date` (required, string): Start date in YYYY-MM-DD format
- `end_date` (required, string): End date in YYYY-MM-DD format
- `symbol` (required, string): Trading pair (e.g., "BTC-USDT")
- `timeframe` (required, string): Timeframe (1m, 3m, 5m, 15m, 30m, 45m, 1h, 2h, 3h, 4h, 6h, 8h, 12h, 1D, 3D, 1W, 1M)
- `config` (optional, object): Backtest configuration (fee, slippage, leverage, etc.)

**Returns:** Metrics including:
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

**Description:** Returns tracked prediction events with their markets from Polymarket.

**Primary Use Case:** Browse prediction markets to find trading opportunities.

**Parameters:**
- `active_only` (optional, boolean): Only return active events (default: true)
- `market_category` (optional, string): Filter by category (e.g., "crypto_rolling", "politics", "economics")

**Returns:** List of prediction events with:
- Event name and category
- Associated markets with condition IDs
- Market questions and outcomes (YES/NO)
- Resolution status

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_all_prediction_events with active_only=true to see current markets
```

---

### `get_prediction_market_data`

**Description:** Returns prediction market metadata and YES/NO token price timeseries.

**Primary Use Case:** Analyze price history and trading patterns for a prediction market.

**Parameters:**
- `condition_id` (required, string): Polymarket condition ID (from get_all_prediction_events)
- `start_date` (optional, string): Filter candles from date (YYYY-MM-DD)
- `end_date` (optional, string): Filter candles to date (YYYY-MM-DD)
- `timeframe` (optional, string): Candle timeframe - `1m`, `5m`, `15m`, `30m`, `1h`, or `4h` (default: 1m)
- `limit` (optional, integer): Maximum candles per token to return (default: 1000, max: 10000)

**Returns:**
- Market metadata (question, outcomes, resolution status, asset, interval)
- YES token price timeseries
- NO token price timeseries

**Pricing:** Tier 1 - Data Access ($0.001)

**Example Usage:**
```
Use get_prediction_market_data with condition_id="0xb0eb..." and timeframe="1h" to analyze market
```

---

### `run_prediction_market_backtest`

**Description:** Test prediction market strategy performance on historical market data.

**Primary Use Case:** Validate Polymarket strategy logic before live trading.

**Parameters:**
- `strategy_name` (required, string): Name of the PolymarketStrategy
- `start_date` (required, string): Start date in YYYY-MM-DD format
- `end_date` (required, string): End date in YYYY-MM-DD format

**For single-market backtest:**
- `condition_id` (string): Polymarket condition ID to test on

**For rolling-market backtest:**
- `asset` (string): Asset symbol (e.g., "BTC", "ETH")
- `interval` (string): Market interval (e.g., "15m", "1h")

**Optional:**
- `initial_balance` (number): Starting USDC balance (default: 10000)
- `timeframe` (string): Strategy execution timeframe (default: 1m)

**Returns:** Backtest metrics including profit/loss, win rate, and position history for YES/NO tokens.

**Pricing:** Tier 3 - Compute ($0.001)

**Execution Time:** ~20-60s

**Example Usage:**
```
# Single market backtest
Use run_prediction_market_backtest on "PriceThreshold" with condition_id="0x123..." from 2025-01-01 to 2025-01-30

# Rolling market backtest (multiple markets)
Use run_prediction_market_backtest on "PriceThreshold" with asset="BTC" interval="15m" from 2025-01-01 to 2025-01-30
```

---

## Deployment Tools

Tools for deploying and managing live trading agents on Hyperliquid.

### `deployment_create`

**Description:** Deploy a strategy to live trading on Hyperliquid.

**Primary Use Case:** Launch automated trading with your backtested strategy.

**Parameters:**
- `strategy_name` (required, string): Name of strategy to deploy
- `symbol` (required, string): Trading pair (e.g., "BTC-USDT")
- `timeframe` (required, string): Candle interval (1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 12h, 1d)
- `leverage` (optional, number, 1-5): Position multiplier (default: 1)
- `deployment_type` (optional, string): "eoa" (wallet) or "vault" (default: eoa)
- `vault_name` (required for vault, string): Unique name for the Hyperliquid vault
- `vault_description` (optional, string): Description for the vault

**Returns:** Deployment ID, status, wallet address, and configuration details.

**Pricing:** $0.50

**Constraints:**
- EOA: Maximum 1 active deployment per wallet
- Hyperliquid Vault: Requires 200+ USDC in wallet, unlimited deployments

**Example Usage:**
```
Deploy MomentumRSI_M to BTC-USDT on 4h timeframe with 2x leverage
```

---

### `deployment_list`

**Description:** List all your deployments with status and performance metrics.

**Primary Use Case:** Monitor your live trading agents and their performance.

**Parameters:** None

**Returns:** List of deployments including:
- Deployment ID and strategy name
- Symbol, timeframe, leverage settings
- Status (pending, running, stopped, failed)
- Deployment type (EOA or Hyperliquid Vault)
- Creation and stop timestamps
- Hyperliquid stats (TVL, PnL, returns)

**Pricing:** Free

**Example Usage:**
```
List all my deployments to see their current status
```

---

### `deployment_start`

**Description:** Start a stopped or failed deployment.

**Primary Use Case:** Resume trading with a previously stopped strategy.

**Parameters:**
- `deployment_id` (required, string): ID of the deployment to start

**Returns:** Updated deployment status.

**Pricing:** Free

**Note:** Can only start deployments with status "stopped" or "failed".

**Example Usage:**
```
Start deployment 72130940-4136-497e-a92f-29bab22d73b2
```

---

### `deployment_stop`

**Description:** Stop a running deployment.

**Primary Use Case:** Halt automated trading when needed.

**Parameters:**
- `deployment_id` (required, string): ID of the deployment to stop

**Returns:** Updated deployment status.

**Pricing:** Free

**Example Usage:**
```
Stop my BTC-USDT deployment
```

---

## Account Tools

Tools for managing credits and viewing account information.

### `get_credit_balance`

**Description:** Get your current USDC credit balance.

**Primary Use Case:** Check available credits before running tools.

**Parameters:** None (requires authentication)

**Returns:**
- `balance_usdc`: Current credit balance in USDC
- `wallet_address`: Associated wallet address

**Pricing:** Free

**Example Usage:**
```
Check my credit balance
```

---

### `get_credit_transactions`

**Description:** View credit transaction history with filtering and pagination.

**Primary Use Case:** Track credit usage and deposits.

**Parameters:**
- `limit` (optional, integer, 1-100): Results per page (default: 20)
- `page` (optional, integer): Page number, 1-indexed (default: 1)
- `transaction_type` (optional, string): Filter by type - `deposit`, `spend`, `withdraw`, or `refund`

**Returns:** Paginated list of transactions with:
- Transaction type and amount
- Timestamp
- Related tool or operation (for spend transactions)

**Pricing:** Free

**Example Usage:**
```
Show my recent credit transactions filtered by spend type
```

---

## Pricing Tiers

Robonet uses a credit-based billing system with different pricing models:

- **Tier 1 - Data Access:** $0.001 fixed cost for database queries
- **Tier 2 - Compute:** $0.001 fixed cost for backtesting
- **Tier 3 - Deployment:** $0.50 fixed cost for creating deployments
- **Tier 4 - AI Generation:** Real LLM cost + margin (billed after execution)
  - Uses actual Claude API costs plus platform margin
  - Maximum price caps listed per tool
  - Typical costs range from $0.50-$3.00 depending on complexity

**Free Tools:**
- `get_strategy_code` - View strategy source code
- `get_strategy_versions` - View version history
- `get_latest_backtest_results` - View recent backtest records
- `deployment_list` - List deployments
- `deployment_start` - Start deployments
- `deployment_stop` - Stop deployments
- `get_credit_balance` - Check credit balance
- `get_credit_transactions` - View transaction history

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
1. get_all_prediction_events (active_only=true) → Find markets
2. get_prediction_market_data (condition_id) → Analyze market
3. create_prediction_market_strategy → Build YES/NO logic
4. run_prediction_market_backtest → Test on historical data
```

### 5. Deploy to Live Trading

```
1. get_all_strategies (include_latest_backtest=true) → Pick proven strategy
2. get_data_availability → Verify symbol has data
3. deployment_create (strategy, symbol, timeframe) → Deploy to Hyperliquid
4. deployment_list → Monitor status and performance
5. deployment_stop → Stop when needed
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

2. **Check Data Availability:** Use `get_data_availability` before backtesting to verify data exists for your chosen symbol and date range.

3. **Cost Management:** AI tools (`create_strategy`, `optimize_strategy`, `enhance_with_allora`) use real LLM costs. Use `generate_ideas` first (cheaper) to explore concepts before committing to full implementation.

4. **Iterative Development:** Use `refine_strategy` for targeted changes instead of regenerating from scratch with `create_strategy`.

5. **Backtest Early:** Always `run_backtest` before `optimize_strategy` to ensure basic logic works.

6. **Version Management:** Use `get_strategy_versions` to track evolution and use `mode="new"` in `refine_strategy` to preserve working versions.

7. **Prediction Markets:** Check `get_all_prediction_events` regularly for new trading opportunities, and use `get_prediction_market_data` to analyze market dynamics before building strategies.

8. **Live Trading:** Use `deployment_list` to monitor your live agents, and `deployment_stop` if you need to halt trading quickly.

---

## Security & Access Control

All MCP tools enforce wallet-based access control:

- **Strategy Ownership:** Only the creating wallet can access, modify, or backtest a strategy
- **API Authentication:** All tools require valid API key (JWT token) from Robonet backend
- **Credit Reservation:** Credits are reserved atomically before execution to prevent TOCTOU issues
- **Input Validation:** All parameters are validated and sanitized to prevent injection attacks

See [MCP Server Setup](/guide/mcp-server) for authentication configuration.
