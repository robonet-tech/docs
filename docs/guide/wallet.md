# Wallet Integration

Robonet uses a modern embedded wallet system powered by Privy that handles authentication, wallet creation, and signing operations. This guide explains how wallets work on Robonet and how to use them securely.

## Supported Authentication Methods

Robonet offers three convenient ways to sign in:

### 1. Email Authentication (Recommended for New Users)
- **How it works:** Sign up with your email address
- **Wallet creation:** Privy automatically creates an embedded Ethereum wallet for you
- **Best for:** New users who don't have a crypto wallet yet
- **Security:** Wallet is secured by your email authentication and Privy's infrastructure

### 2. External Wallet Connection
- **How it works:** Connect an existing Ethereum wallet (MetaMask, WalletConnect, etc.)
- **Wallet creation:** Privy still creates an embedded wallet for server-side signing
- **Best for:** Users who prefer to authenticate with their existing wallet
- **Security:** You maintain control of your external wallet; embedded wallet is created separately

### 3. Social Authentication (Twitter)
- **How it works:** Sign in with your Twitter account
- **Wallet creation:** Privy automatically creates an embedded Ethereum wallet for you
- **Best for:** Quick sign-up without email
- **Security:** Wallet is secured by your Twitter authentication and Privy's infrastructure

::: tip
All authentication methods create an embedded Ethereum wallet automatically. This wallet enables server-side signing for trading operations without requiring you to manually approve every transaction.
:::

## Supported Networks

Robonet integrates with two blockchain networks:

### Base Network (Layer 2 Ethereum)
- **Purpose:** Payment and credit purchases
- **Currency:** USDC stablecoin
- **Chain ID:** 8453 (mainnet), 84532 (testnet)
- **Why Base:** Lower transaction fees and faster confirmations than Ethereum mainnet
- **USDC Contract:** `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

### Hyperliquid (DEX)
- **Purpose:** Trading venue for deployed strategies
- **Supported assets:** Perpetual futures contracts
- **Deployment types:**
  - **EOA (Externally Owned Account):** Direct trading with your wallet (limit 1 active deployment)
  - **Vault:** Create a Hyperliquid vault (minimum 200 USDC, unlimited deployments)

::: warning Network Selection
When depositing USDC for credits, ensure you're using the **Base network** (Chain ID 8453). Sending USDC on other networks (Ethereum mainnet, Polygon, etc.) will result in lost funds that cannot be recovered.
:::

## Wallet Connection Flow

### New User Setup

When you first sign up on Robonet:

1. **Choose Authentication Method**
   - Select email, wallet, or Twitter authentication
   - Complete the authentication process

2. **Embedded Wallet Creation**
   - Privy automatically creates an Ethereum wallet for you
   - Your wallet address (starting with `0x`) is displayed in the navigation bar
   - This wallet is stored securely by Privy's infrastructure

3. **Wallet Delegation (Required)**
   - You'll be prompted to grant delegation permissions
   - **What delegation means:** Allows Robonet's backend to sign transactions on your behalf
   - **Why it's needed:** Enables automated trading strategies without manual approval for every trade
   - **Security:** Delegation is specific to Robonet's TEE (Trusted Execution Environment) signer
   - **Control:** You can revoke delegation at any time through Privy

4. **Confirm Delegation**
   - Click "Grant Delegation" in the modal
   - Approve the delegation in the Privy popup
   - Backend verifies delegation status
   - You're now ready to use Robonet!

**Screenshot placeholder:** *Modal showing "Grant Delegation" button with explanation of what delegation enables*

::: tip First-Time Setup
The entire sign-up and wallet creation process takes less than 2 minutes. Privy handles all the complexity of wallet management behind the scenes.
:::

### Returning User Flow

When you return to Robonet:

1. **Automatic Authentication**
   - If you're still logged in with Privy, you'll be automatically authenticated
   - Backend verifies your session and loads your user data

2. **Delegation Check**
   - System verifies that delegation is still active
   - If delegation was revoked, you'll be prompted to re-grant it

3. **Ready to Go**
   - Your wallet balance, credits, and strategies load automatically
   - Continue building and managing strategies

## Wallet Permissions Required

### Authentication Permissions

Robonet requests the following permissions from Privy:

1. **Read wallet address:** To identify your account and link your data
2. **Email address (if email auth):** For account recovery and notifications
3. **Twitter profile (if Twitter auth):** To verify your identity

### Delegation Permissions

When you grant delegation, you're giving Robonet permission to:

1. **Sign trading transactions:** Execute buy/sell orders on Hyperliquid
2. **Deploy strategies:** Create vaults and manage deployments
3. **Manage positions:** Update stop losses, take profits, and close positions

::: warning
Delegation does NOT allow Robonet to:
- Transfer funds out of your wallet
- Access other dApps or protocols
- Make changes to your Privy account settings
- Withdraw your USDC credit balance (only you can initiate withdrawals)
:::

## Security Best Practices

### Account Security

1. **Protect Your Login Credentials**
   - Use a strong, unique password for email authentication
   - Enable two-factor authentication (2FA) if available through Privy
   - Keep your Twitter account secure if using social auth

2. **Verify the Site**
   - Always check you're on the correct Robonet domain before logging in
   - Look for HTTPS and a valid SSL certificate
   - Bookmark the official site to avoid phishing attempts

3. **Never Share Your API Key**
   - API keys grant full access to your Robonet account
   - Generate a new API key if you suspect compromise
   - Use separate API keys for different MCP clients if desired

### Wallet Security

1. **Understand Delegation Scope**
   - Delegation only applies to Robonet's trading operations
   - It does NOT grant access to your external wallets (MetaMask, etc.)
   - Revoke delegation if you stop using Robonet

2. **Monitor Your Activity**
   - Regularly check your deployment history and trade logs
   - Review credit transactions and billing history
   - Report suspicious activity immediately via the feedback button

3. **Secure Your Funds**
   - Only deposit what you plan to use for trading
   - Withdraw unused USDC credits to your external wallet
   - Use small amounts for testing before deploying significant capital

### Privy-Specific Security

1. **Recovery Methods**
   - Set up account recovery through Privy's settings
   - Add backup email addresses or phone numbers
   - Understand that Privy manages your embedded wallet's private keys

2. **Delegation Management**
   - Review delegated wallets in Privy dashboard
   - Revoke delegation if you no longer trust the application
   - Re-delegation requires re-approval through Privy

## Troubleshooting

### Connection Issues

**Problem:** "Failed to connect wallet"
- **Solution:** Refresh the page and try again
- **Cause:** Temporary network issues or Privy service unavailability
- **Workaround:** Clear browser cache and cookies, try a different browser

**Problem:** "Privy access token expired"
- **Solution:** Log out and log back in
- **Cause:** Your authentication session expired (typical after 24 hours)
- **Prevention:** The app auto-refreshes tokens, but manual re-login may be needed occasionally

### Delegation Issues

**Problem:** "Delegation required" modal keeps appearing
- **Solution:**
  1. Make sure you clicked "Grant Delegation" in the Privy popup
  2. Wait 2-3 seconds after granting for backend verification
  3. If it persists, log out and log back in
- **Cause:** Timing issue between frontend delegation and backend verification
- **Technical:** Backend retries delegation check 3 times with delays

**Problem:** "Delegation verification failed"
- **Solution:**
  1. Check that you have an embedded wallet (shown in Privy dashboard)
  2. Verify you approved the correct wallet address
  3. Contact support if issue persists
- **Cause:** Mismatch between expected wallet and delegated wallet
- **Workaround:** Generate a new API key to reset delegation state

### Network Issues

**Problem:** "Insufficient funds" when buying credits
- **Solution:**
  1. Ensure you're on the **Base network** (not Ethereum mainnet)
  2. Check your USDC balance on Base
  3. Bridge USDC to Base if needed
- **Cause:** Most users have USDC on Ethereum mainnet, not Base L2
- **Bridge:** Use [bridge.base.org](https://bridge.base.org) to move funds to Base

**Problem:** USDC deposit not showing up
- **Solution:**
  1. Verify you sent USDC on **Base network** to the correct deposit address
  2. Wait 2-3 minutes for 12 confirmations
  3. Check transaction on [BaseScan](https://basescan.org)
- **Cause:** Wrong network, insufficient confirmations, or transaction failed
- **Prevention:** Always double-check network selection before sending

**Problem:** Can't switch to Base network in wallet
- **Solution:**
  1. Add Base network manually to your wallet:
     - Network Name: Base Mainnet
     - RPC URL: `https://mainnet.base.org`
     - Chain ID: 8453
     - Currency: ETH
     - Block Explorer: `https://basescan.org`
  2. Most modern wallets auto-detect Base when you try to interact with it
- **Cause:** Base network not pre-configured in your wallet

### Transaction Issues

**Problem:** "Transaction failed" when deploying strategy
- **Solution:**
  1. Check you have sufficient credits (reservations are atomic)
  2. Verify Hyperliquid connectivity
  3. Review error message for specific failure reason
- **Cause:** Insufficient credits, Hyperliquid downtime, or invalid strategy configuration
- **Workaround:** Test strategy with backtest before deploying live

**Problem:** EOA deployment limit reached
- **Solution:**
  1. Stop your existing EOA deployment before creating a new one
  2. Or switch to Vault deployment type (unlimited, 200 USDC minimum)
- **Cause:** Database enforces unique constraint: 1 active EOA per user
- **Reason:** Hyperliquid EOA limitation prevents multiple active deployments per wallet

## FAQ

### Do I need to own cryptocurrency before using Robonet?

No. You can sign up with just an email address. Privy creates an embedded wallet for you automatically. You'll need USDC on Base network to purchase credits for AI tools and backtesting, but you can start exploring for free with the welcome bonus.

### What happens to my wallet if I lose access to my account?

Your embedded wallet is managed by Privy. If you lose access to your Privy account, follow Privy's account recovery process using the recovery methods you set up (backup email, phone number, etc.). Robonet cannot recover your Privy account.

### Can I use my own wallet (MetaMask, etc.) for trading?

Robonet always uses the embedded wallet created by Privy for trading operations. You can connect external wallets for authentication, but the trading wallet is the embedded one. This design enables server-side signing for automated strategies.

### Is delegation safe? Can Robonet steal my funds?

Delegation is scoped to Robonet's trading operations on Hyperliquid only. It does NOT allow:
- Transferring funds out of your wallet
- Accessing other protocols or dApps
- Withdrawing your USDC credit balance

All trading operations are logged and auditable. You can revoke delegation at any time through Privy's interface.

### How do I revoke wallet delegation?

To revoke delegation:
1. Go to the Privy dashboard (accessible from your Privy login)
2. Navigate to "Delegated Wallets" or "Connections"
3. Find Robonet's TEE signer
4. Click "Revoke Delegation"

Note: After revoking, you'll need to re-grant delegation to continue using Robonet's trading features.

### What's the difference between embedded wallet and external wallet?

- **Embedded wallet:** Created and managed by Privy, used for all trading operations on Robonet. Enables server-side signing for automated strategies.
- **External wallet:** Your personal wallet (MetaMask, WalletConnect, etc.), used only for authentication. Not used for trading on Robonet.

### Can I export my embedded wallet's private key?

Privy provides export functionality for embedded wallets in some cases. Check Privy's documentation and your Privy dashboard settings. However, exporting private keys reduces security and is generally not recommended.

### Why do I need USDC on Base specifically?

Robonet uses Base (an Ethereum Layer 2) for payment processing because:
- **Lower fees:** Base transactions cost pennies instead of dollars
- **Faster confirmation:** ~2 seconds vs ~12 seconds on Ethereum mainnet
- **Same security:** Base inherits Ethereum's security through rollups
- **Gasless payments:** x402 protocol enables USDC purchases without needing ETH for gas

### Do I need ETH for gas fees?

No! Robonet supports gasless USDC purchases through the x402 protocol. Third-party facilitators (Dexter, PayAI, Coinbase CDP) pay gas fees on your behalf. You only need USDC to buy credits.

For direct on-chain deposits, you'll need a small amount of ETH on Base (~$0.01 worth) to pay gas for the USDC transfer transaction.

### What happens if Privy goes down?

Privy is a well-funded infrastructure provider used by many dApps. In the unlikely event of extended Privy downtime:
- Robonet would implement wallet recovery mechanisms
- Your funds and data remain safe (your private keys are your assets)
- Existing deployments continue running (they don't require Privy for execution)

### Can I use multiple wallets with one Robonet account?

No. Each Robonet account is tied to a single embedded wallet address. The wallet address is used as your unique identifier across the platform. To use multiple wallets, you'd need to create separate Robonet accounts.

## Next Steps

Now that you understand wallet integration:

- **Chat users:** Continue to [Chat Interface Guide](/guide/chat-interface.md) to start building strategies
- **MCP users:** Set up [MCP Server Integration](/guide/mcp-server.md) for AI agent access
- **Learn about billing:** Read [Billing & Credits](/guide/billing.md) to understand costs

For questions or issues not covered here, use the feedback button in the app or contact support.
