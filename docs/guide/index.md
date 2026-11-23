# What is Robonet?

Robonet has two parts:

- **Robonet Vaults** let strategy teams accept capital from investors under rules written into the contract. Investors deposit USDC, the team trades, and the vault enforces how shares are valued and how investors get their money back. See [Robonet Vaults](/vaults/).
- **The quant engine** turns a trading idea into a tested strategy. It creates strategy code, backtests it, optimizes it and can add Allora Network predictions. You use it from your AI coding agent through the Robonet MCP server.

This section covers the quant engine.

```
  TRADING IDEA ──▶ QUANT ENGINE ──────────────────────────▶ STRATEGY ──▶ DEPLOYMENT
                   create · backtest · optimize · Allora               or a Robonet Vault
                   (from your AI coding agent, over MCP)
```

## Why Robonet exists

Existing DeFi trading tools force a tradeoff. Either you are technical enough to code, deploy and monitor your own strategies around the clock, or you hand custody to an asset manager and trust that their interests match yours. Strategy marketplaces give you ideas but leave execution as your problem.

Robonet gives you the tools to express an idea, test it and run it, and gives investors vaults whose rules they can check before they invest.

## The quant engine mental model

- **Intent** is your trading idea in plain language: "buy ETH when momentum is strong", "capture funding rates while staying delta-neutral".
- **Strategy** is that idea compiled into structured logic: entry and exit conditions, position sizing, risk parameters and indicator settings. It is complete code that you own.
- **Agent** is a strategy deployed to run. Once it is live, the strategy cannot be modified, so what you optimized is exactly what runs.
- **Vault** is the on-chain container that holds the capital an agent trades.
- **Capital** stays non-custodial. You choose where to deposit, and allocation follows on-chain records.

## Capabilities

### Strategy generation

Describe your trading idea in plain language. The engine generates executable strategy code. See [Strategy Creation](/guide/strategies).

### Backtesting

Test your strategies against historical market data, with detailed performance metrics. See [Backtesting](/guide/backtesting).

### Optimization

Tune your strategy's parameters automatically to find a better configuration for your goals. See [Optimization](/guide/optimization).

### Allora Network predictions

Use decentralized price predictions from the Allora Network as signals in your strategies. See [Allora AI Price Predictions](/guide/allora).

### Polymarket strategies

Build and deploy automated strategies on Polymarket prediction markets. See [Polymarket Overview](/guide/polymarket).

### Deployment

Deploy a strategy to run on Hyperliquid or Polymarket. See [Deployment](/guide/strategy-deployment).

## How to use the quant engine

Connect the Robonet MCP server to an AI coding agent such as Claude Code, Cursor or Windsurf. Then ask your agent to create, backtest and optimize strategies. Agent skills teach the agent how to use Robonet well.

- [MCP Server Setup](/guide/mcp-server)
- [MCP Tools Reference](/guide/mcp-tools)
- [Agent Skills](/guide/agent-skills)

## Getting started

See the [Quick Start guide](/guide/quick-start).
