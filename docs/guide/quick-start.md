# Quick Start

This guide will help you get started with Robonet in just a few minutes.

## What You Can Build

Robonet enables you to create automated trading strategies that execute on Hyperliquid Perpetual markets and Polymarket prediction markets. Here are some examples of what's possible:

### Example 1: Trend Following Strategy

A strategy that identifies strong price trends and enters positions when momentum confirms:
- **Entry**: When price crosses above 50-day moving average AND RSI shows momentum
- **Exit**: When trend weakens or profit target is reached
- **Risk Management**: Stop-loss at 2% below entry, position size based on volatility

This type of strategy benefits from backtesting to validate the parameters (50-day MA, RSI thresholds) and optimization to find the best risk/reward settings.

### Example 2: Mean Reversion with Allora Predictions

A strategy that trades against short-term price extremes, enhanced with Allora Network price predictions:
- **Entry**: When price is 2+ standard deviations from mean AND Allora prediction aligns
- **Allora Signal**: Use decentralized ML predictions as confirmation filter
- **Exit**: When price returns to mean or time-based exit after 4 hours
- **Risk Management**: Tight stop-loss at 1%, higher position turnover

This demonstrates how Allora Network integration can add a predictive layer to traditional technical analysis.

## Set Up

You use the quant engine from an AI coding agent such as Claude Code, Cursor or Windsurf:

1. Get your Robonet API key
2. Add the Robonet MCP server to your coding agent
3. Ask your agent to create, backtest and optimize strategies

[Set up the MCP server →](/guide/mcp-server)

Optionally, install the [Agent Skills](/guide/agent-skills). They teach your agent how to use Robonet and how to work as a quant trader.

## Typical Workflow

Here's the typical flow:

1. **Generate Strategy**: Describe your trading idea or ask for suggestions
2. **Backtest**: Test the strategy against historical data (default: recent 6 months)
3. **Review Results**: Analyze performance metrics (Sharpe ratio, max drawdown, win rate)
4. **Optimize** (optional): Fine-tune parameters to improve performance
5. **Deploy**: Launch your strategy on Hyperliquid (EOA or Vault) or Polymarket (Vault on Polygon)

## Next Steps

Once your agent is connected:

- Learn about [Strategy Creation](/guide/strategies)
- Understand [Backtesting](/guide/backtesting)
- Explore [Allora Network Integration](/guide/allora)
- Try [Polymarket Strategies](/guide/polymarket)
- Read about [Deployment Options](/guide/strategy-deployment)
- Run a strategy for investors in a [Robonet Vault](/vaults/)
