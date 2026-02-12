# Supported Trading Venues

Robonet supports trading on **Hyperliquid Perpetual** and **Polymarket** prediction markets.

## Decentralized Exchanges (DEXs)

### Hyperliquid Perpetual

**Status:** Fully Supported (Mainnet + Testnet)

**Type:** Decentralized perpetual futures exchange

**Asset Types:**
- Perpetual futures contracts (perpetuals)
- Leverage trading (configurable leverage up to platform limits)
- USDC-denominated positions

**Supported Pairs:**
Hyperliquid offers a wide range of perpetual futures pairs. Use the [`get_all_symbols`](/guide/mcp-tools#get_all_symbols) MCP tool to see the current list of available trading pairs.

**Deployment Types:**
- **EOA (Externally Owned Account):** Trade directly with your wallet
  - Limitation: Maximum 1 active deployment per user
  - No minimum capital requirement
- **Hyperliquid Vault:** Create a vault for your strategy
  - Minimum: 200 USDC
  - Unlimited deployments per user
  - Hyperliquid Vault creation handled automatically via MCP or chat interface

**Network Support:**
- **Mainnet:** Production trading with real funds
- **Testnet:** Paper trading for testing strategies without risk

**Special Requirements:**
- USDC balance for trading capital (on Hyperliquid)
- Robonet credits for platform usage (purchased with USDC on Base network)
- Wallet delegation for server-side signing (handled via Privy authentication)

**Features:**
- Low fees
- Fast execution
- On-chain orderbook
- No KYC required
- Self-custodial (EOA mode) or vault-based trading

**Data Availability:**
- Historical candle data available for backtesting
- Multiple timeframes: 1m, 5m, 15m, 30m, 1h, 2h, 4h, 6h, 12h, 1d
- Default backtest period: 6 months (configurable)

---

## Prediction Markets

### Polymarket

**Status:** Fully Supported (Polygon Mainnet)

**Type:** Decentralized prediction market (CLOB-based)

**Asset Types:**
- Binary outcome tokens (YES/NO)
- USDC.e denominated positions on Polygon

**Market Types:**
- **Rolling series** — Recurring crypto markets (e.g., "BTC up or down in 15m") that auto-transition between rounds
- **Single markets** — One-time event markets with a fixed resolution date

**Deployment Type:**
- **Polymarket Vault** — ERC-4626 tokenized vault with Gnosis Safe
  - Minimum: 10 POL for gas + 10 USDC.e for trading
  - Maximum 1 active Polymarket deployment per user
  - Other users can deposit into your vault
  - Performance fees configurable (1–20%)

**Network:**
- **Polygon Mainnet** — All trading and vault contracts deployed on Polygon

**Special Requirements:**
- POL on Polygon for vault contract deployment gas (~10 POL)
- USDC.e on Polygon for trading capital
- Robonet credits for platform usage
- Wallet delegation for server-side signing (via Privy)

**Features:**
- Automated rolling market transitions
- On-chain vault accounting (ERC-4626)
- Keeper-managed position reporting and withdrawals
- Gasless Gnosis Safe deployment via Polymarket relayer
- Full backtesting support (single market and rolling series)

**Data Availability:**
- Historical YES/NO token price data for backtesting
- Multiple timeframes: 1m, 5m, 15m, 30m, 1h, 4h
- Rolling and single market data

::: tip Learn More
See the [Polymarket Strategies guide](/guide/polymarket) for comprehensive documentation on building, backtesting, and deploying prediction market strategies.
:::

---

## Centralized Exchanges (CEXs)

**Status:** Not Currently Supported

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
- Join the [Discord community](https://discord.gg/robonet)
- [Contact us directly](mailto:support@robonet.finance)
:::

---

## Comparison Table

| Venue | Type | Asset Types | Status | Deployment Types | Min Capital |
|-------|------|-------------|--------|------------------|-------------|
| **Hyperliquid Perpetual** | DEX | Perpetuals | Supported | EOA, Hyperliquid Vault | 0 (EOA), 200 USDC (Hyperliquid Vault) |
| **Polymarket** | Prediction Market | YES/NO Tokens | Supported | Polymarket Vault | 10 POL + 10 USDC.e |
| Binance | CEX | Spot, Futures | Not Supported | - | - |
| Bybit | CEX | Spot, Futures | Not Supported | - | - |
| OKX | CEX | Spot, Futures | Not Supported | - | - |
| Uniswap | DEX | Spot | Not Supported | - | - |
| GMX | DEX | Perpetuals | Not Supported | - | - |
| dYdX | DEX | Perpetuals | Not Supported | - | - |

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

## Related Documentation

- [MCP Tools Reference](/guide/mcp-tools) - See `get_all_symbols` tool for listing available pairs
- [Wallet Integration](/guide/wallet) - Setup wallet for Hyperliquid trading
- [Deployment Guide](/guide/deployment) - Deploy strategies to Hyperliquid (EOA or Hyperliquid Vault)
- [Strategy Creation](/guide/strategies) - Build strategies for Hyperliquid
- [Backtesting](/guide/backtesting) - Test strategies with historical Hyperliquid data
