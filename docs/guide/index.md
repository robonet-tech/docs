# What is Robonet?

Robonet is a platform that enables you to build and deploy agentic trading bots without writing code. Whether you're a trader looking to automate your strategies or a developer integrating with your preferred AI coding assistant, Robonet provides the tools you need.

## Why Robonet Exists

Existing DeFi trading tools force a tradeoff: either you're technical enough to code, deploy, and monitor your own strategies 24/7, or you hand custody to an asset manager and hope their interests align with yours. Copy-trading makes you reactive – always following, never owning. Strategy marketplaces give you ideas but leave execution as your problem. 

Robonet exists because capital deserves infrastructure that lets anyone with an idea express it, test it, own it, and deploy it – without writing code, surrendering custody, or trusting black boxes.

## The Robonet Mental Model

Five abstractions define how Robonet works, each building on the last to take you from idea to autonomous execution:

- **Intent** is your trading idea in plain language: "buy ETH when momentum is strong," "capture funding rates while staying delta-neutral."
- **Strategy** is that trading idea compiled into structured logic – entry conditions, exit conditions, position sizing, risk parameters, indicator configuration – complete code you own.
- **Agent** is a strategy deployed on-chain; once live, the strategy cannot be modified, so what you optimized is exactly what runs. Agents continuously evaluate present market conditions and make decisions guarded by immutable strategy code.
- **Hyperliquid Vault** is the onchain primitive holding capital allocated to an agent, either private (your capital only) or public (pooled capital where creators can charge performance fees).
- **Capital** is non-custodial – you choose where to deposit, Robonet never holds your funds, and allocation follows verified onchain records.

## Capabilities

### Strategy Generation
Describe your trading idea in plain language. The AI generates executable strategy code.

### Backtesting
Test your strategies against historical market data to understand how they would have performed. Get detailed performance metrics and visualizations.

### Optimization
Fine-tune your strategy parameters using automated optimization. Find the best configuration for your trading goals.

### Allora Network Integration
Leverage decentralized price predictions from the Allora Network as signals in your strategies. Access crowd-sourced market intelligence.

### Polymarket Strategies
Build and deploy automated prediction market strategies on Polymarket. Trade YES/NO tokens on real-world events with ERC-4626 vault infrastructure on Polygon.

### Deployment
Deploy your strategies to production with one click. Robonet handles hosting, execution, and monitoring.

## How to Use Robonet

There are two ways to use Robonet:

### Chat Interface
For traders who want a guided experience. Access the web interface and interact with the AI through conversation.

[Learn about the Chat Interface](/guide/chat-interface)

### MCP Server
Ideal for developers using AI coding assistants like Claude Code, Cursor, or Windsurf. Integrate Robonet directly into your development workflow.

[Learn about MCP Server Integration](/guide/mcp-server)

## Getting Started

See the [Quick Start guide](/guide/quick-start).
