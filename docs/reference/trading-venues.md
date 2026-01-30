# Supported Trading Venues

Robonet currently supports trading on **Hyperliquid Perpetual** only. Support for additional exchanges and DEXs is planned for future releases.

## Decentralized Exchanges (DEXs)

### Hyperliquid Perpetual

**Status:** ✅ Fully Supported (Mainnet + Testnet)

**Type:** Decentralized perpetual futures exchange

**Asset Types:**
- Perpetual futures contracts (perpetuals)
- Leverage trading (configurable leverage up to platform limits)
- USDC-denominated positions

**Supported Pairs:**
Hyperliquid offers a wide range of perpetual futures pairs. Use the [`get_all_symbols`](/reference/mcp-tools#get_all_symbols) MCP tool to see the current list of available trading pairs.

**Deployment Types:**
- **EOA (Externally Owned Account):** Trade directly with your wallet
  - Limitation: Maximum 1 active deployment per user
  - No minimum capital requirement
- **Vault:** Create a Hyperliquid vault for your strategy
  - Minimum: 200 USDC
  - Unlimited deployments per user
  - Vault creation handled automatically via MCP or chat interface

**Network Support:**
- **Mainnet:** Production trading with real funds
- **Testnet:** Paper trading for testing strategies without risk

**Special Requirements:**
- USDC balance for trading capital (on Hyperliquid)
- Robonet credits for platform usage (purchased with USDC on Base network)
- Wallet delegation for server-side signing (handled via Privy authentication)

**Key Features:**
- Low fees and fast execution
- On-chain orderbook
- No KYC required
- Self-custodial (EOA mode) or vault-based trading

**Data Availability:**
- Historical candle data available for backtesting
- Multiple timeframes: 1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 12h, 1d
- Default backtest period: 6 months (configurable)

---

## Centralized Exchanges (CEXs)

**Status:** ❌ Not Currently Supported

Robonet does not currently support centralized exchanges like Binance, Bybit, OKX, Coinbase, or others. All trading is done on Hyperliquid Perpetual.

Support for CEXs may be added in future releases based on user demand.

---

## Coming Soon

The Robonet team is evaluating additional trading venues for future support:

### Under Consideration
- Additional DEX perpetual futures platforms
- Spot trading on DEXs (Uniswap, etc.)
- Selected centralized exchanges

::: info Request Support for a Venue
If you'd like to see support for a specific exchange or DEX, please share your feedback:
- Join the [Discord community](https://discord.gg/allora)
- [Open an issue on GitHub](https://github.com/allora-network/robonet/issues)
- [Contact us directly](mailto:support@allora.network)
:::

---

## Comparison Table

| Venue | Type | Asset Types | Status | Deployment Types | Min Capital |
|-------|------|-------------|--------|------------------|-------------|
| **Hyperliquid Perpetual** | DEX | Perpetuals | ✅ Supported | EOA, Vault | 0 (EOA), 200 USDC (Vault) |
| Binance | CEX | Spot, Futures | ❌ Not Supported | - | - |
| Bybit | CEX | Spot, Futures | ❌ Not Supported | - | - |
| OKX | CEX | Spot, Futures | ❌ Not Supported | - | - |
| Uniswap | DEX | Spot | ❌ Not Supported | - | - |
| GMX | DEX | Perpetuals | ❌ Not Supported | - | - |
| dYdX | DEX | Perpetuals | ❌ Not Supported | - | - |

---

## Technical Details

### Exchange Identifiers

When using the MCP server or working with strategy configurations, use these exact exchange identifiers:

- **Mainnet:** `"Hyperliquid Perpetual"`
- **Testnet:** `"Hyperliquid Perpetual Testnet"`

**Example (MCP tool usage):**
```
"Which symbols are available for Hyperliquid Perpetual?"
```

**Example (Strategy config YAML):**
```yaml
strategy:
  execution_exchange: "Hyperliquid Perpetual"
  symbol: "BTC-USDC"
  timeframe: "5m"
```

### Symbol Format

Hyperliquid uses the format: `BASE-QUOTE`

**Examples:**
- `BTC-USDC`
- `ETH-USDC`
- `SOL-USDC`
- `AVAX-USDC`

::: tip Get Available Symbols
Use the `get_all_symbols` MCP tool to retrieve the current list of supported trading pairs:
- Via chat: "Show me all available trading pairs"
- Via MCP client: Call the `get_all_symbols` tool with optional `exchange` filter
:::

---

## Frequently Asked Questions

### Why only Hyperliquid?

Robonet's initial release focuses on Hyperliquid Perpetual because:
1. **Decentralized and self-custodial**: Aligns with Robonet's security philosophy
2. **No KYC required**: Easier onboarding for users
3. **High-quality infrastructure**: Fast execution, low fees, good liquidity
4. **Perpetuals-first**: Ideal for algorithmic trading strategies
5. **API-friendly**: Excellent developer experience

Additional venues will be added based on user demand and technical feasibility.

### Can I use the same strategy across different exchanges?

Not yet. Since Robonet currently only supports Hyperliquid, all strategies run on Hyperliquid Perpetual.

When additional exchanges are added in the future, you'll need to:
- Update the strategy configuration to specify the target exchange
- Ensure the trading pair exists on that exchange
- Re-backtest the strategy (different exchanges have different fee structures, liquidity, and execution characteristics)

### What if the pair I want isn't available on Hyperliquid?

Currently, Robonet only supports pairs available on Hyperliquid Perpetual. If your desired pair isn't listed:
1. Check if Hyperliquid has added it recently using the `get_all_symbols` tool
2. Consider trading a correlated asset (e.g., similar sector or market cap)
3. Request the pair be added to Hyperliquid (contact Hyperliquid support)
4. Wait for Robonet to add support for additional exchanges

### Is spot trading supported?

No. Robonet currently only supports perpetual futures trading on Hyperliquid. Spot trading is not available.

Spot trading may be added in future releases based on user demand.

### Can I trade on testnet before going live?

Yes! Hyperliquid Perpetual Testnet is fully supported. Use testnet to:
- Test strategies without risking real funds
- Verify strategy logic and execution
- Practice deployment workflows
- Debug issues before mainnet deployment

To use testnet, specify `"Hyperliquid Perpetual Testnet"` as the exchange in your strategy configuration or chat prompts.

### How do I know if a venue is supported?

The most reliable way to check supported venues is:
1. Check this documentation page (updated with each release)
2. Use the `get_all_symbols` tool with no `exchange` filter to see all available exchanges
3. Review the [MCP Tools Reference](/reference/mcp-tools) for exchange-related tools

---

## Related Documentation

- [MCP Tools Reference](/reference/mcp-tools) - See `get_all_symbols` tool for listing available pairs
- [Wallet Integration](/guide/wallet) - Setup wallet for Hyperliquid trading
- [Deployment Guide](/guide/deployment) - Deploy strategies to Hyperliquid (EOA or Vault)
- [Strategy Creation](/guide/strategies) - Build strategies for Hyperliquid
- [Backtesting](/guide/backtesting) - Test strategies with historical Hyperliquid data
