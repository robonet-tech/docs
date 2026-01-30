# Chat Interface Guide

This guide walks you through using Robonet's chat interface to build, test, and deploy algorithmic trading strategies through natural conversation.

## Overview

The chat interface provides a conversational way to:
- Generate trading strategy ideas
- Implement strategies with AI assistance
- Run backtests and analyze results
- Optimize strategy parameters
- Integrate Allora Network price predictions
- Deploy strategies to live trading

**Best for:** Traders who prefer natural language over code, and want guided assistance through the strategy development process.

## Getting Started

### 1. Account Creation and Login

#### Creating Your Account

1. Visit the Robonet platform and click "Sign In"
2. You'll be prompted to authenticate via Privy
3. Privy creates an embedded wallet for you automatically
4. If you have an invitation access code, enter it when prompted
5. Complete authentication to access your account

#### Wallet Connection

After authentication, you'll need to connect a NEAR wallet for trading:

1. The platform will prompt you to connect a NEAR wallet
2. Choose from supported wallets:
   - MyNearWallet
   - Meteor Wallet
   - HERE Wallet
   - Ethereum wallets (via bridge)
3. Authorize wallet delegation for automated trading
4. Your wallet address is now linked to your account

**Important:** Wallet delegation is required for deployments. This allows Robonet to execute trades on your behalf according to your strategy parameters.

#### Network Selection

- Switch between NEAR mainnet and testnet via the network selector
- Testnet is recommended for initial testing with no real funds
- Your chat sessions and strategies are wallet-scoped (separate per network)

### 2. Starting a Chat Session

Once logged in:

1. Click "New Chat" in the sidebar to start a fresh session
2. Previous sessions are saved and accessible from the sidebar
3. Each session maintains its own conversation history
4. Sessions auto-save to your browser's local storage

**Screenshot placeholder:** Chat interface with sidebar showing session list

## Building Strategies

### Generating Strategy Ideas

The chat interface helps you brainstorm and refine trading ideas.

**Example conversation:**

```
You: I want to build a momentum strategy for Bitcoin
AI: I can help you create a momentum-based strategy. Let me suggest a few approaches:

1. RSI + Moving Average Crossover
2. Breakout strategy with volume confirmation
3. Trend-following with ATR stops

Which approach interests you most, or would you like to explore a different direction?

You: Let's go with the RSI and moving average approach

AI: Great choice! I'll create a momentum strategy that:
- Uses RSI to identify oversold/overbought conditions
- Confirms with EMA crossovers for trend direction
- Includes ATR-based stop losses for risk management

Let me implement this strategy for you...
```

The AI will:
1. Ask clarifying questions about your preferences
2. Suggest multiple approaches
3. Explain the reasoning behind each approach
4. Generate a complete strategy implementation

### Requesting Strategy Implementation

Once you've refined your idea, ask the AI to implement it:

```
You: Create this strategy for BTC-USDT on the 4-hour timeframe
```

**What happens behind the scenes:**

1. The AI calls the `create_strategy` tool
2. You'll see a tool execution status card showing progress
3. The strategy code is generated based on your conversation
4. The completed strategy is saved to your account

**Tool Execution Interface:**

While tools execute, you'll see:
- Tool name and status (running/success/error)
- Progress indicators with estimated time
- Expandable details showing execution steps
- Results or error messages when complete

**Screenshot placeholder:** Tool execution status card showing running state

## Testing Strategies

### Running Backtests

Once a strategy is created, test it with historical data:

```
You: Backtest MomentumRSI on BTC-USDT with 4h timeframe for the last 6 months
```

The platform will:
1. Execute the `run_backtest` tool
2. Run your strategy against historical data
3. Generate performance metrics and equity curve
4. Display results in an interactive card

**Backtest Parameters:**

- **Symbol**: Trading pair (e.g., BTC-USDT)
- **Timeframe**: Candlestick interval (1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 12h, 1d)
- **Date Range**: Historical period to test (default: 6 months)
- **Data Source**: Currently Hyperliquid Perpetual only

### Interpreting Backtest Results

The backtest result card displays key metrics:

#### Performance Metrics

- **Total Return**: Overall percentage gain/loss
- **Net Profit**: Dollar amount of profit/loss
- **Annual Return**: Annualized performance
- **Sharpe Ratio**: Risk-adjusted return (higher is better)
  - `< 1.0`: Poor risk-adjusted returns
  - `1.0 - 2.0`: Good performance
  - `> 2.0`: Excellent performance
- **Sortino Ratio**: Similar to Sharpe, but only penalizes downside volatility

#### Risk Metrics

- **Max Drawdown**: Largest peak-to-trough decline (lower is better)
  - `< 20%`: Conservative
  - `20-40%`: Moderate risk
  - `> 40%`: Aggressive/high risk
- **Calmar Ratio**: Return divided by max drawdown (higher is better)

#### Trading Activity

- **Total Trades**: Number of completed trades
- **Win Rate**: Percentage of profitable trades
  - `< 40%`: Needs improvement
  - `40-60%`: Typical for many strategies
  - `> 60%`: Strong performance
- **Profit Factor**: Gross profit / gross loss (above 1.0 = profitable)
- **Avg Win/Loss**: Average profit vs loss per trade

#### Equity Curve

The equity curve shows your account value over time:
- **Upward trend**: Strategy is profitable
- **Smooth curve**: Consistent performance
- **Volatile swings**: High risk, consider optimization
- **Flat line**: Strategy isn't trading or is break-even

**Screenshot placeholder:** Backtest result card with metrics and equity curve chart

### Understanding "No Trades" Results

If your backtest shows "No trades executed":

**Common causes:**
- Entry conditions are too strict
- Timeframe doesn't match strategy logic
- Insufficient historical data for indicators
- Symbol doesn't match strategy requirements

**What to do:**
1. Review strategy entry/exit conditions
2. Try a longer backtest period
3. Adjust indicator parameters
4. Ask the AI to optimize the strategy

## Optimizing Strategies

### Strategy Optimization Process

If backtest results aren't satisfactory, optimize your strategy:

```
You: Optimize MomentumRSI to maximize Sharpe ratio
```

The AI will:
1. Call the `optimize_strategy` tool
2. Test multiple parameter combinations
3. Find optimal values for:
   - Indicator periods (RSI, EMA, ATR, etc.)
   - Entry/exit thresholds
   - Risk management parameters
4. Return improved parameters with performance comparison

**Optimization Targets:**

- **Sharpe Ratio**: Maximize risk-adjusted returns
- **Total Return**: Maximize absolute profit
- **Max Drawdown**: Minimize largest loss
- **Win Rate**: Maximize percentage of winning trades
- **Profit Factor**: Maximize profit-to-loss ratio

**Example result:**

```
Original Strategy:
- RSI Period: 14
- RSI Oversold: 30
- RSI Overbought: 70
- Sharpe Ratio: 1.2

Optimized Strategy:
- RSI Period: 21
- RSI Oversold: 25
- RSI Overbought: 75
- Sharpe Ratio: 2.1 (+75% improvement)
```

**Important Considerations:**

- **Overfitting Risk**: Optimized strategies may perform worse in live trading if over-tuned to historical data
- **Multiple Backtests**: Test optimized parameters across different time periods
- **Walk-Forward Analysis**: Ask the AI to validate on out-of-sample data

## Allora Network Integration

### Price Prediction Enhancement

Allora Network provides ML-powered price predictions. Integrate them into your strategy:

```
You: Enhance MomentumRSI with Allora Network price predictions
```

The AI will:
1. Call the `enhance_with_allora` tool
2. Integrate Allora predictions as additional signals
3. Adjust entry/exit logic to incorporate ML forecasts
4. Generate a new strategy version with Allora integration

**How Allora Predictions Work:**

- Allora Network aggregates predictions from multiple AI models
- Predictions are made for various time horizons (short/medium/long-term)
- Your strategy can use predictions as:
  - **Confirmation signals**: Enter only when prediction agrees with technical indicators
  - **Filters**: Avoid trades against predicted direction
  - **Weightings**: Adjust position sizing based on prediction confidence

**Example Integration:**

```
Original Entry Condition:
- RSI < 30 (oversold)
- Fast EMA crosses above Slow EMA

Enhanced Entry Condition:
- RSI < 30 (oversold)
- Fast EMA crosses above Slow EMA
- Allora 24h prediction shows > 2% upside
```

**Benefits:**

- Improved win rate by filtering false signals
- Better risk management through prediction confidence
- Access to institutional-grade ML models
- Reduced drawdowns during market regime changes

### Prediction Market Strategies

Create strategies specifically for prediction markets (Polymarket, etc.):

```
You: Create a prediction market strategy for BTC price in February 2026
```

The AI will:
1. Call `get_prediction_market_data` to fetch market timeseries
2. Analyze YES/NO token pricing trends
3. Generate a strategy to trade prediction markets
4. Backtest on historical prediction market data

**Prediction Market Card:**

View prediction market data directly in chat:
- YES/NO token prices over time
- Market resolution status
- High/low/current prices
- Interactive dual-token chart

**Screenshot placeholder:** Prediction market card with YES/NO token timeseries

## Deploying Strategies

### Deployment Overview

Once you're satisfied with backtest results, deploy your strategy to live trading.

### Deployment Types

**EOA (Externally Owned Account):**
- Trades directly with your connected wallet
- Maximum 1 active deployment per user
- Immediate setup, no minimum balance
- Best for: Testing with small capital

**Vault:**
- Creates a Hyperliquid vault for your strategy
- Unlimited vaults per user
- Requires 200 USDC minimum
- Best for: Production trading with larger capital

### Creating a Deployment

From chat, request deployment:

```
You: Deploy MomentumRSI to BTC-USDT on 4h timeframe with 2x leverage
```

Or navigate to your Profile → Strategies tab and click "Deploy" on a saved strategy.

**Deployment Configuration:**

1. **Deployment Type**: EOA or Vault
2. **Symbol**: Trading pair (e.g., BTC-USDT)
3. **Timeframe**: Candlestick interval (must match backtest)
4. **Leverage**: 1x - 5x (higher leverage = higher risk)
5. **Vault Details** (if Vault deployment):
   - Vault Name (unique)
   - Description (minimum 10 characters)

**Risk Warnings:**

- Leverage amplifies both gains and losses
- Start with lower leverage (1-2x) until proven profitable
- Monitor positions regularly
- Set appropriate stop losses in your strategy

### Deployment Lifecycle

**Status Flow:**

1. **Pending**: Deployment request submitted
2. **Building**: Docker container being created
3. **Starting**: Kubernetes workload launching
4. **Running**: Strategy is live and trading
5. **Stopping**: Deployment shutdown in progress
6. **Stopped**: Deployment inactive
7. **Failed**: Error occurred (check logs)

**Monitoring:**

The Live Strategies page shows:
- **Status**: Current deployment state
- **TVL**: Total Value Locked (vault only)
- **PnL**: Profit and Loss (absolute + percentage)
- **Returns**: 24h/7d/30d performance
- **Chart**: Mini equity curve
- **Trading**: Active/inactive indicator
- **Actions**: Stop/Start/Retry buttons

**Optimistic UI:**

When you stop/start a deployment, the UI updates immediately while the API call completes in the background. This provides instant feedback without waiting for server response.

**Screenshot placeholder:** Live Strategies table with multiple deployments

### Managing Deployments

**From the Chat Interface:**

```
You: Stop my BTC-USDT deployment

You: Start the MomentumRSI deployment again
```

**From the Live Strategies Page:**

1. Navigate to Profile → Live Strategies
2. Find your deployment in the table
3. Click the action button (⋮) in the Actions column
4. Select Stop/Start/Retry

**Deployment Constraints:**

- **EOA Deployments**: Only 1 active at a time (must stop existing before starting a new one)
- **Vault Deployments**: Unlimited active deployments
- **Wallet Delegation Required**: Must authorize delegation before deploying
- **Insufficient Balance**: Deployment will fail if insufficient USDC in wallet

**Error Handling:**

- **Insufficient Credits**: Add credits to your account
- **Failed Deployment**: Check error message and retry
- **Connection Issues**: Deployments continue running even if you disconnect

## Tips and Best Practices

### Strategy Development

1. **Start Simple**: Begin with basic strategies before adding complexity
2. **Backtest Thoroughly**: Test on at least 6 months of data, preferably 1+ year
3. **Multiple Timeframes**: Validate strategy on different timeframes
4. **Out-of-Sample Testing**: Reserve recent data for final validation
5. **Walk-Forward**: Test on rolling windows, not just one period

### Risk Management

1. **Conservative Leverage**: Start with 1-2x leverage
2. **Position Sizing**: Never risk more than 2-5% of capital per trade
3. **Stop Losses**: Always include stop losses in your strategy
4. **Max Drawdown**: Don't deploy strategies with >40% historical drawdown
5. **Diversification**: Run multiple uncorrelated strategies

### Live Trading

1. **Paper Trade First**: Use testnet to verify strategy execution
2. **Small Capital**: Start with minimum viable amount
3. **Monitor Closely**: Check deployments daily for the first week
4. **Performance Tracking**: Compare live performance to backtest
5. **Kill Switches**: Know how to stop deployments quickly if needed

### Using the Chat Effectively

1. **Be Specific**: Provide clear requirements (symbol, timeframe, risk tolerance)
2. **Iterate**: Start with a concept, refine through conversation
3. **Ask Questions**: The AI can explain concepts and strategy logic
4. **Request Modifications**: Ask for specific changes to strategies
5. **Save Sessions**: Name sessions descriptively for easy reference

## Troubleshooting

### Common Issues

**"Insufficient Credits" Error:**
- Solution: Add credits via Profile → Billing
- Tool execution requires credits based on complexity
- AI tools bill actual LLM cost + margin

**Deployment Won't Start:**
- Check wallet delegation is authorized
- Verify sufficient USDC balance (200 min for vaults)
- Ensure no other EOA deployment is active
- Check error message in deployment status

**No Trades in Backtest:**
- Entry conditions may be too restrictive
- Try longer backtest period
- Adjust indicator parameters
- Ask AI to optimize or debug strategy

**Chat Session Not Loading:**
- Clear browser cache and reload
- Check network connection
- Try creating a new session
- Contact support if issue persists

**Message Queue Stuck:**
- If message shows "sending" indefinitely, refresh page
- Previous message must complete before next is sent
- Cancel operation if needed

### Getting Help

**In-Chat Support:**

```
You: I need help understanding why my strategy has no trades
```

The AI can:
- Debug strategy logic
- Explain metrics and results
- Suggest improvements
- Guide through platform features

**External Resources:**

- [MCP Tools Reference](/reference/mcp-tools) - Full list of available tools
- [Backtesting Guide](/guide/backtesting) - Deep dive into backtest analysis
- [Deployment Guide](/guide/deployment) - Detailed deployment documentation
- [Discord Community](https://discord.gg/allora) - Ask questions and share strategies
- [GitHub Issues](https://github.com/allora-network/robonet/issues) - Report bugs
- [Email Support](mailto:support@allora.network) - Direct assistance

## Next Steps

- [Explore MCP Server Setup](/guide/mcp-server) for programmatic access
- [Learn About Backtesting](/guide/backtesting) in detail
- [Understand Allora Integration](/guide/allora) for ML predictions
- [Review Billing & Credits](/guide/billing) for cost management
- [Read MCP Tools Reference](/reference/mcp-tools) for all available tools

---

**Note:** Screenshots will be added in a future update. Placeholder notes indicate where visual aids will be inserted.
