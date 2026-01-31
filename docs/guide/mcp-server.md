# MCP Server Setup

The Robonet MCP (Model Context Protocol) server allows you to integrate Robonet's trading strategy tools directly into your AI coding environment. This guide will help you set up the MCP server for use with Claude Code, Cursor, Windsurf, or other MCP-compatible clients.

## Quick Start

Get started with Robonet MCP in under 5 minutes:

### 1. Get Your API Key

1. Sign up at [robonet.finance](https://robonet.finance)
2. Navigate to **Settings** → **API Keys** → **Generate New API Key**
3. Copy your API key (store it securely - you won't see it again)

### 2. Configure Your Client

Choose your AI coding assistant and add the Robonet MCP server:

::: code-group

```json [Claude Desktop]
// Add to: ~/Library/Application Support/Claude/claude_desktop_config.json (macOS)
// Or: %APPDATA%\Claude\claude_desktop_config.json (Windows)
{
  "mcpServers": {
    "robonet": {
      "type": "http",
      "url": "https://mcp.robonet.finance/mcp?api_key=<API_KEY>"
    }
  }
}
```

```sh [Claude Code (CLI)]
claude mcp add robonet --transport http https://mcp.robonet.finance/mcp?api_key=<API_KEY>
```

```json [Claude Code (JSON)]
// Add to: ~/.claude.json (macOS/Linux)
// Or: <project folder>\.mcp.json (Windows)
{
  "mcpServers": {
    "robonet": {
      "type": "http",
      "url": "https://mcp.robonet.finance/mcp?api_key=<API_KEY>"
    }
  }
}
```

```json [Cursor]
// Open Cursor Settings → MCP → Add MCP Server
{
  "mcpServers": {
    "robonet": {
      "type": "http",
      "url": "https://mcp.robonet.finance/mcp?api_key=<API_KEY>"
    }
  }
}
```

```toml [Codex]
# Add to your .codex/config.toml
[mcp_servers.robonet]
url = "https://mcp.robonet.finance/mcp?api_key=<API_KEY>"
```

:::

::: warning
Replace `<API_KEY>` with your actual API key from Step 1. Never commit your API key to version control.
:::

### 3. Verify Setup

1. Restart your AI client
2. Ask: *"Can you list available trading symbols on Robonet?"*
3. Your AI should call the `get_all_symbols` MCP tool and return symbols like ETH-USD, BTC-USD, etc.

✅ If you see trading symbols, you're all set! Try creating your first strategy:

```
"Generate a simple RSI mean reversion strategy for ETH-USD and backtest it"
```

## Overview

The MCP server provides 17 specialized tools for building, testing, and deploying trading strategies:

- **Data tools** (7): Browse strategies, symbols, technical indicators, and Allora topics
- **AI-powered tools** (6): Generate ideas, create strategies, enhance with Allora predictions
- **Backtesting** (2): Run backtests and optimize strategy parameters
- **Prediction markets** (4): Create and backtest prediction market strategies

## Example Workflow

Here's a typical workflow using the Robonet MCP server:

### 1. Generate Strategy Ideas

```
You: "Generate 3 trading strategy ideas based on current market conditions for ETH-USD"

AI: [Calls generate_ideas tool]
- Returns: 3 strategy concepts with entry/exit logic, risk management, and rationale
```

### 2. Create a Strategy

```
You: "Implement the RSI mean reversion strategy for ETH-USD on 1-hour timeframe"

AI: [Calls create_strategy tool]
- Returns: Complete Python strategy code following Jesse framework conventions
```

### 3. Run a Backtest

```
You: "Backtest this strategy from 2024-06-01 to 2025-01-01"

AI: [Calls run_backtest tool]
- Returns: Performance metrics (Sharpe ratio, win rate, max drawdown, total return, etc.)
- Includes: Equity curve data and trade statistics
```

### 4. Optimize Parameters

```
You: "Optimize the RSI period parameter between 10 and 20"

AI: [Calls optimize_strategy tool]
- Returns: Best parameter values and performance improvements
- Creates: New optimized version of the strategy
```

### 5. Enhance with Allora

```
You: "Enhance this strategy with Allora Network price predictions"

AI: [Calls enhance_with_allora tool]
- Returns: New strategy version that incorporates ML predictions as signals
- Preserves: Original strategy logic while adding predictive layer
```

### 6. Deploy to Production

```
You: "Deploy the RSI mean reversion strategy"

AI: [Calls deployment_create tool]
- Returns: Deployment status
```

## Available MCP Tools

For a complete reference of all 17 MCP tools with detailed parameters and examples, see:

→ [MCP Tools Reference](/reference/mcp-tools)

## Troubleshooting

### "Insufficient Credits" Error

**Solution**: Purchase credits in your Robonet dashboard:
1. Log in to [robonet.finance](https://robonet.finance)
2. Navigate to **Settings** → **Billing**
3. Click **Purchase Credits**
4. Complete the payment

### "Invalid API Key" Error

**Solutions**:
1. Verify your API key is correct (no extra spaces or characters)
2. Regenerate your API key if it's expired or compromised:
   - Dashboard → Settings → API Keys → Regenerate
3. Update your MCP client configuration with the new key
4. Restart your AI client

### "Tool Not Found" Error

**Solutions**:
1. Check the tool name spelling (e.g., `create_strategy` not `createStrategy`)
2. Verify your MCP client is connected to the server:
   - Look for "robonet" in your client's MCP servers list
   - Check server status indicator (should be green/connected)
3. Restart your MCP client to refresh the tool registry

### Connection Timeout

**Solutions**:
1. Check your internet connection
2. Verify the MCP server endpoint URL is correct: `https://mcp.robonet.finance/mcp?api_key=<API_KEY>`
3. Check if Robonet services are operational (status page or Discord)
4. Try again in a few minutes (may be temporary network issue)

### Strategy Not Showing in Web Interface

**Solution**: Strategies are linked to your user account via API key. Ensure:
1. You're logged in with the same account that owns the API key
2. The strategy was successfully created (check AI response for confirmation)
3. Refresh the **My Strategies** page in the web interface

## Tips & Best Practices

### Efficient Workflow

1. **Start with ideas**: Use `generate_ideas` to explore market-driven concepts
2. **Iterate quickly**: Create simple strategies first, then enhance
3. **Always backtest**: Never deploy without comprehensive backtesting
4. **Optimize wisely**: Only optimize parameters that impact strategy logic
5. **Enhance selectively**: Allora predictions work best for trend-following strategies

### Cost Management

1. **Free tools first**: Browse strategies, symbols, and indicators without cost
2. **Batch operations**: Create multiple strategy variations in one conversation
3. **Reuse backtests**: Review existing backtest results before running new ones
4. **Monitor credits**: Check your balance regularly in the dashboard

### Strategy Development

1. **Descriptive names**: Use clear names like `RSI_MeanReversion_M` (M = medium risk)
2. **Version control**: MCP preserves strategy history automatically
3. **Test thoroughly**: Backtest across different market conditions (bull, bear, sideways)
4. **Risk management**: Always include stop-loss and position sizing logic

### Collaboration

1. **Share strategy names**: Team members can reference strategies by name
2. **Document decisions**: Ask your AI to explain strategy logic for team review
3. **Export results**: Copy backtest metrics to share with stakeholders

## Next Steps

- **Learn more about MCP tools**: [MCP Tools Reference](/reference/mcp-tools)
- **Understand backtesting**: [Backtesting Guide](/guide/backtesting)
- **Deploy your strategy**: [Deployment Guide](/guide/deployment)
- **Explore Allora integration**: [Allora Network Guide](/guide/allora)

## Support

Need help? We're here for you:

- **Discord**: [Join our community](https://discord.gg/robonet)
- **Email**: [support@robonet.finance](mailto:support@robonet.finance)
