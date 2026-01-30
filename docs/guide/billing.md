# Payment & Billing

This guide explains how Robonet's pricing and credit system works, how to purchase credits, and how to manage your account balance.

## Overview

Robonet uses a **credit-based billing system** where you pay for what you use. There are no subscription tiers or monthly fees - you simply purchase credits in USDC (stablecoin) and they're deducted as you use the platform's tools and features.

**Key Features:**
- **Pay-as-you-go**: No subscriptions or recurring charges
- **Transparent pricing**: Each tool has a fixed or predictable cost
- **Welcome bonus**: $25 free credits for all new users

## Pricing Structure

### Understanding Pricing Types

Robonet uses two pricing models:

- **<u>Fixed Pricing:</u>** Tools with a set cost per execution. You pay the same amount every time.
- **<u>Real Pricing (AI Tools):</u>** AI-powered tools charge based on actual LLM usage with a maximum cap. The actual cost depends on the complexity of your request and can range from $0.01 to the listed maximum. Most executions cost significantly less than the maximum.

---

### Tool Pricing Categories

Robonet tools are organized into pricing tiers based on computational and AI resource requirements:

#### Free/Low-Cost Data Access ($0.0001-0.10)
- **Get all strategies** - $0.001: List your strategies
- **Get strategy code** - $0.10: View strategy source code
- **Get strategy versions** - $0.01: View version history
- **Get latest backtest results** - $0.001: View past backtest results
- **Get all symbols** - $0.001: Get trading pair information
- **Get all technical indicators** - $0.001: List available indicators
- **Get Allora topics** - $0.0001: List available ML prediction topics
- **Get all prediction events** - $0.001: List prediction market events
- **Get prediction market data** - $0.001: Get market timeseries data
- **Get top leaderboard strategies** - $0.001: View top-performing strategies
- **Import strategy** - $0.001: Import existing strategy code

#### Standard Compute Tools ($0.001-0.01)
- **Run backtest** - $0.001: Test your strategy on historical data (fast, no AI)
- **Run prediction market backtest** - $0.001: Test prediction market strategies
- **Run Monte Carlo backtest** - $0.01: Advanced statistical backtesting

#### AI-Powered Tools (Real pricing, max $1.00-$4.50)
These tools charge based on actual LLM costs with the following maximums:
- **Generate ideas** - max $1.00: Get strategy suggestions based on market conditions
- **Enhance with Allora** - max $2.50: Integrate ML price predictions
- **Refine strategy** - max $3.00: AI-powered strategy refinement
- **Optimize strategy** - max $4.00: AI-powered parameter optimization
- **Create strategy** - max $4.50: Generate complete trading strategy from description
- **Create prediction market strategy** - max $4.50: Generate prediction market strategies

::: tip Real Pricing Explained
AI tools show a maximum price, but typically cost much less. For example, "create strategy" has a max of $4.50 but simple strategies might only cost $0.50-$1.50. You're only charged for the actual LLM tokens used, not the maximum.
:::

#### Deployment Tools ($0.05)
- **Create deployment** - $0.05: Create new deployment (EOA or Vault)
- **List deployments** - $0.05: View your deployments
- **Start live trading** - $0.05: Activate a deployed strategy
- **Stop live trading** - $0.05: Stop a running strategy

::: tip Cost Control
Start with free data access tools (get all symbols, get all strategies) to explore. Use "generate ideas" (typically $0.20-0.50) to explore concepts before using "create strategy" (typically $0.50-2.00 but max $4.50). Test with "run backtest" ($0.001) before deploying.
:::

### Typical Workflow Costs

Here are estimated costs for common workflows (using typical AI costs, not maximums):

**Exploring Strategy Ideas** (~$0.40-1.20):
- Generate ideas: ~$0.20-0.50 (max $1.00)
- Create strategy: ~$0.80-2.00 (max $4.50)
- **Typical Total**: ~$1.00-2.50

**Testing a Strategy** (~$1.00-3.50):
- Create strategy: ~$0.80-2.00 (max $4.50)
- Run backtest: $0.001
- Optimize strategy: ~$0.60-1.50 (max $4.00)
- **Typical Total**: ~$1.40-3.50

**Enhanced Strategy with Allora** (~$2.50-6.00):
- Create strategy: ~$0.80-2.00 (max $4.50)
- Enhance with Allora: ~$0.50-1.20 (max $2.50)
- Run backtest: $0.001
- Optimize strategy: ~$0.60-1.50 (max $4.00)
- Run final backtest: $0.001
- Create deployment: $0.05
- **Typical Total**: ~$2.00-5.00

**Quick Strategy Iteration** (~$0.002):
- Get all symbols: $0.001
- Run backtest: $0.001
- **Total**: $0.002

## Payment Methods

Robonet supports two ways to purchase credits:

### 1. Gasless Payment (Recommended)

The **x402 protocol** enables you to purchase credits with USDC without paying gas fees. A third-party facilitator pays the gas on your behalf.

**How it works:**
1. Click "Buy Credits" in the web interface
2. Enter the amount in USDC (minimum $1.00)
3. Approve the transaction in your wallet (no gas required)
4. Credits appear instantly in your account

**Screenshot placeholder:** Buy Credits modal showing amount input and x402 payment flow

**Supported x402 Facilitators:**
- Dexter (11M+ transactions, $737K+ volume)
- PayAI (13.4M+ transactions, $323K+ volume)
- Coinbase CDP (requires API keys)

::: tip No Gas Fees
x402 payments don't require you to hold ETH or pay gas fees. The facilitator handles all on-chain settlement and gas costs.
:::

### 2. Direct On-Chain Deposit

You can deposit USDC directly from any wallet to your Robonet deposit address.

**How it works:**
1. Navigate to "Deposit" in your account settings
2. Copy your unique deposit address
3. Send USDC (Base network) from any wallet
4. Credits are automatically added after 12 block confirmations (~2-3 minutes)

**Network Details:**
- **Chain**: Base mainnet (Chain ID: 8453)
- **Token**: USDC (0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)
- **Minimum**: $1.00 USDC
- **Confirmations required**: 12 blocks

**Screenshot placeholder:** Deposit address display with QR code and copy button

::: warning Network Selection
Make sure you're sending USDC on the **Base network**, not Ethereum mainnet or other chains. Sending to the wrong network will result in lost funds.
:::

## Billing Cycles

**There are no billing cycles.** Robonet operates on a pure usage-based model:

- Credits are purchased once and remain valid indefinitely
- Tools deduct credits immediately when executed
- No monthly/annual subscriptions
- No automatic renewals
- No expiration dates

## Account Balance & Limits

### Checking Your Balance

You can view your current balance at any time:

**In the web interface:**
- Balance displayed in the top right corner
- Click for detailed breakdown of deposits, spending, and withdrawals

**Via API:**
```bash
GET /api/v1/credits/balance
```

**Balance Details:**
- **Available balance**: Credits you can spend right now
- **Reserved credits**: Credits held during active tool execution
- **Total deposited**: Lifetime deposits (excluding welcome bonus)
- **Total spent**: Lifetime spending across all tools
- **Total withdrawn**: Lifetime withdrawals back to your wallet

### Welcome Bonus

All new users receive a **$25 welcome bonus** to explore the platform.

**Important notes:**
- One-time bonus per account
- Cannot be withdrawn (only used for tools)
- Tracked separately from deposited credits
- Spent before deposited credits

### Rate Limits

To ensure fair usage, Robonet enforces these limits:

**API Rate Limit:**
- 100 requests per 60 seconds per IP address
- Applies to all endpoints except chat streams
- Returns HTTP 429 if exceeded

**Credit Limits:**
- Minimum purchase: $1.00 USDC
- Minimum withdrawal: $1.00 USDC
- No maximum limits

**Account Blocking:**
If your balance goes negative (rare edge case), your account is automatically blocked until the balance is resolved.

## Managing Credits

### Viewing Transaction History

**In the web interface:**
1. Go to Account Settings → Billing
2. View paginated list of all transactions
3. Filter by type: deposits, spending, withdrawals, refunds

**Via API:**
```bash
GET /api/v1/credits/transactions?page=1&limit=50
```

**Transaction Types:**
- **Deposit**: Credits added via x402 or on-chain transfer
- **Spend**: Credits deducted for tool usage
- **Withdraw**: Credits sent back to your wallet
- **Refund**: Credits returned if tool execution fails
- **Failed deduction**: Insufficient balance during tool execution

Each transaction shows:
- Amount in USDC (6 decimal precision)
- Balance before/after
- Transaction status (pending, confirmed, failed, reversed)
- On-chain transaction hash (for deposits/withdrawals)
- Tool name (for spending transactions)
- Timestamp

### Withdrawing Credits

You can withdraw your deposited credits back to your wallet at any time (if withdrawals are enabled by the platform).

**How it works:**
1. Go to Account Settings → Billing → Withdraw
2. Enter the amount to withdraw (minimum $1.00)
3. Confirm the withdrawal
4. USDC is sent to your connected wallet on Base network

**Withdrawal Rules:**
- Only deposited credits can be withdrawn (welcome bonus excluded)
- Withdrawable amount = total deposited - total withdrawn
- No withdrawal fees (configurable by platform)
- Withdrawals processed via hot wallet

::: warning Withdrawal Availability
Withdrawals may not be enabled in all environments. Check your account settings to see if this feature is available.
:::

### Credit Reservations

When you execute a tool, credits are **reserved** before execution begins. This prevents race conditions where your balance changes mid-execution.

**How it works:**
1. Tool requests execution
2. System reserves the required credits (locks them)
3. Tool executes
4. Credits are deducted based on actual cost
5. Any excess reserved credits are released back to your balance

**Reservation Details:**
- Reservations expire after 10 minutes if not confirmed
- Reserved credits are subtracted from your available balance
- Expired reservations are automatically released
- You can see active reservations in your account details

## Frequently Asked Questions

### Do I need a subscription?

No. Robonet has no subscription tiers or monthly fees. You simply purchase credits and use them as needed.

### What happens if I run out of credits?

Tools will fail to execute if you don't have sufficient credits. You'll receive an error message prompting you to purchase more credits. Your balance is checked before each tool execution.

### Can I get a refund?

Yes. If a tool execution fails, credits are automatically refunded to your account. You can also withdraw your deposited credits at any time (if withdrawals are enabled).

### How are AI tool costs calculated?

AI-powered tools use **real pricing** based on actual LLM token usage. The system reserves the maximum possible cost upfront (e.g., $4.50 for "create strategy"), but only charges the actual cost after execution. Simple requests might cost $0.50-1.00, while complex multi-step strategies might cost $2.00-4.00. You're never charged more than the stated maximum.

Non-AI tools have **fixed pricing** ($0.0001-0.10 per execution) and always cost the same amount.

### Is there a discount for high-volume usage?

Currently, pricing is the same for all users. Enterprise or high-volume users can contact support for custom pricing arrangements.

### What payment methods are supported?

Robonet accepts USDC stablecoin via:
1. **x402 gasless payment** (recommended) - no gas fees required
2. **Direct on-chain deposit** to your deposit address on Base network

### Do I need ETH to use the platform?

No. The recommended x402 payment method doesn't require ETH or gas fees. The facilitator covers all gas costs.

### What blockchain network do you use?

Robonet's payment system operates on **Base** (Ethereum L2 network, Chain ID: 8453) using USDC as the payment token.

### How long do deposits take?

- **x402 payments**: Instant (usually <30 seconds)
- **On-chain deposits**: 2-3 minutes (after 12 block confirmations)

### What happens to my credits if I stop using Robonet?

Your credits remain valid indefinitely. You can withdraw them back to your wallet at any time (if withdrawals are enabled).

### Are there any hidden fees?

No hidden fees. All tool costs are displayed upfront, and there are no withdrawal fees (unless configured by the platform). The x402 facilitator covers gas costs.

### How do I track my spending?

View your complete transaction history in Account Settings → Billing. Every credit transaction is logged with full details: amount, tool name, timestamp, and balance changes.

### Can I share credits with another account?

No. Credits are non-transferable between accounts. Each account must purchase and manage its own credits.

### What if a tool takes too long and I want to cancel?

Credit reservations expire after 10 minutes if the tool doesn't complete. The credits will be automatically released back to your balance. You cannot manually cancel an in-progress tool execution.

### Is my payment information secure?

Yes. Robonet uses industry-standard wallet authentication (Privy) and never handles your private keys. All payments are on-chain and transparent. The x402 protocol uses cryptographic signatures for gasless payments.

### How can I optimize my costs?

**Cost-saving tips:**
- Use low-cost data access tools ($0.001) to explore before AI tools
- Start with "generate ideas" (~$0.20-0.50) before "create strategy" (~$0.80-2.00)
- Keep AI prompts clear and concise to minimize LLM token usage
- Use "run backtest" ($0.001) multiple times before optimization
- Review backtest results carefully before running optimization (~$0.60-1.50)
- Test strategies on shorter time periods first (same cost, faster results)
- Use the welcome bonus ($25) to experiment with different workflows

---

## Need Help?

If you have questions about billing or need assistance:

- **Documentation**: Check other guides in this documentation
- **Support**: Contact support through the web interface
- **API Reference**: See the [API documentation](./api-reference.md) for programmatic access
- **Transaction Issues**: Check your transaction history and on-chain confirmations

::: tip Getting Started
New users receive a $25 welcome bonus. This is enough to:
- Generate 25-125 strategy ideas (depending on complexity)
- Create 5-30 strategies (depending on complexity)
- Run 25,000 backtests
- Optimize 6-40 strategies (depending on complexity)
- Run 250,000 data access queries

Remember: AI tools show maximum prices but typically cost 20-50% of the maximum. Your $25 will go further than you think!
:::
