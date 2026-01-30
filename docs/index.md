---
layout: home

hero:
  name: Robonet
  text: Build and Deploy Agentic Trading Bots
  tagline: Create powerful trading strategies with AI assistance, backtest them, and deploy them to Hyperliquid Perpetual
  actions:
    - theme: brand
      text: Quick Start
      link: /guide/quick-start
    - theme: alt
      text: What is Robonet?
      link: /guide/

features:
  - icon: 💬
    title: Chat Interface for Traders
    details: Build strategies through natural conversation - no coding required. Perfect for traders who want to focus on ideas, not implementation.
    link: /guide/chat-interface
    linkText: Learn about Chat
  - icon: 🔌
    title: MCP Server for Developers
    details: Integrate with Claude Code, Cursor, or Windsurf. Use 17 specialized tools to build, test, and deploy strategies programmatically.
    link: /guide/mcp-server
    linkText: Learn about MCP
  - icon: 📊
    title: Comprehensive Backtesting
    details: Test strategies against historical data with 200+ technical indicators. Get detailed metrics including Sharpe ratio, drawdown, and win rate.
    link: /guide/backtesting
    linkText: View Metrics
  - icon: 🔮
    title: Allora Network Integration
    details: Enhance strategies with decentralized ML-powered price predictions. Compare performance before and after Allora integration.
    link: /guide/allora
    linkText: Learn More
  - icon: 🚀
    title: Production Deployment
    details: Deploy to Hyperliquid Perpetual with EOA (direct wallet) or Vault (200 USDC minimum). Kubernetes-managed execution with monitoring.
    link: /guide/deployment
    linkText: Deploy Now
  - icon: 💳
    title: Credit-Based Billing
    details: Pay only for what you use. AI tools billed at cost + margin, compute tools at fixed rates. No subscriptions required.
    link: /guide/billing
    linkText: View Pricing
---

## Two Ways to Build Trading Strategies

### For Traders: Chat Interface
Perfect for non-technical users who want a guided experience. Describe your strategy in plain English and let the AI handle the implementation.

[Get Started with Chat →](/guide/chat-interface)

### For Developers: MCP Integration
Integrate Robonet directly into your AI coding assistant workflow. Access 17 specialized tools for strategy creation, backtesting, and deployment.

[Set Up MCP Server →](/guide/mcp-server)

## Platform Overview

Robonet is a three-tier platform designed for algorithmic trading on Hyperliquid Perpetual:
- **Frontend**: Next.js web interface for chat-based strategy building
- **Backend**: FastAPI service handling authentication, credits, and deployments
- **Workbench**: Jesse framework + MCP server with 200+ technical indicators

Learn more in the [Platform Architecture](/reference/architecture) documentation.
