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

## Choose Your Path

Robonet offers two different interfaces depending on your needs:

### Should I use Chat or MCP?

**Use the Chat Interface if you:**
- Want a conversational, guided experience
- Prefer to describe strategies in natural language
- Don't need to version control your strategy code
- Want to quickly iterate on ideas without switching tools

**Use the MCP Server if you:**
- Already use AI coding assistants (Claude Code, Cursor, Windsurf)
- Want programmatic control over strategy development
- Need to integrate trading strategy generation into your dev workflow
- Prefer to work in your own code editor with version control

### For Traders: Chat Interface

If you prefer a guided, conversational experience, use the chat interface:

1. Visit [robonet.finance](https://robonet.finance)
2. Create an account or log in
3. Start chatting with the AI to generate your first strategy

Suited for non-technical users

[Learn more about the Chat Interface →](/guide/chat-interface)

### For Developers: MCP Server

If you use AI coding assistants like Claude Code, Cursor, or Windsurf:

1. Install the Robonet MCP server
2. Configure your coding assistant
3. Use MCP tools directly in your development workflow

Suited for developers using AI coding assistants

[Learn more about MCP Server Setup →](/guide/mcp-server)

## Typical Workflow

Regardless of which interface you choose, here's the typical flow:

1. **Generate Strategy**: Describe your trading idea or ask for suggestions
2. **Backtest**: Test the strategy against historical data (default: recent 6 months)
3. **Review Results**: Analyze performance metrics (Sharpe ratio, max drawdown, win rate)
4. **Optimize** (optional): Fine-tune parameters to improve performance
5. **Deploy**: Launch your strategy on Hyperliquid (EOA or Vault) or Polymarket (Vault on Polygon)

## Next Steps

Once you've chosen your interface:

- Learn about [Strategy Creation](/guide/strategies)
- Understand [Backtesting](/guide/backtesting)
- Explore [Allora Network Integration](/guide/allora)
- Try [Polymarket Strategies](/guide/polymarket)
- Read about [Deployment Options](/guide/strategy-deployment)
