# Alpha Vaults

An Alpha Vault holds investor capital in a smart contract on HyperEVM and trades on Hyperliquid. The contract enforces the trading permissions, the share value and the withdrawal rules. The operator cannot change them on its own.

| | |
|---|---|
| **Network** | HyperEVM. Orders execute on HyperCore, Hyperliquid's trading layer |
| **Deposit asset** | USDC on HyperEVM |
| **Network fees** | Paid in HYPE |
| **Markets** | Hyperliquid perpetuals and spot markets on the vault's market whitelist |
| **Shares** | ERC-4626 |
| **Audit** | The Alpha engine was audited by Hashlock. Each vault's Transparency tab shows the audit status of its deployed release |

## Three guarantees

### Trading without withdrawal rights

The operator trades through a **trading key**. The trading key can place and cancel orders. It has no path to move funds out of the vault. Funds can only move between the vault and its own Hyperliquid account.

### Share value from on-chain state

The vault calculates its share value from on-chain balances and its HyperCore account state. The operator never submits a valuation. Anyone can check the inputs.

### A recovery path for every investor

Each withdrawal request has a service target. If the vault does not pay a request by then, and the vault's cash cannot cover it, **anyone** can start recovery. Recovery cancels open orders, closes positions and returns the money to the vault, so that the request can be paid. See [Recovery](/vaults/withdrawals#recovery-alpha).

## How it works

Every order passes the contract before it reaches the market.

```
 1. STRATEGY          2. TRADING KEY         3. VAULT CHECKS          4. HYPERLIQUID
 ┌──────────┐        ┌──────────────┐       ┌──────────────────┐      ┌──────────────┐
 │ signals  │ ─────▶ │ place order  │ ────▶ │ market whitelist │ ───▶ │ order rests  │
 │ decide   │        │ cancel order │       │ price band       │      │ under the    │
 │ the trade│        │ (no withdraw)│       │ leverage cap     │      │ vault's own  │
 └──────────┘        └──────────────┘       │ destination lock │      │ account      │
                                            └──────────────────┘      └──────────────┘
                                              a failed check reverts
```

1. **Your strategy** decides what to trade.
2. **The trading key** sends the order to the vault contract.
3. **The vault checks the order** against the rules set at launch. If a check fails, the transaction reverts and nothing reaches the market.
4. **Hyperliquid executes** the order under the vault's own account. The vault reads its value from that same account, so the share value always reflects the actual positions.

## Trading rules

The operator sets these rules at launch. The contract applies them to every order for the life of the vault. A change goes through a [term change](/vaults/operate#change-the-terms-of-a-live-vault).

| Rule | What it does |
|---|---|
| **Market whitelist** | Lists the markets the vault can trade. An order on any other market reverts. |
| **Price band** | Checks a new order's price against a band around the market price. An order outside the band reverts. |
| **Leverage cap** | Sets the maximum leverage. The cap is written into the contract. |
| **Destination lock** | Funds can only move back to the vault. The contract rejects any other destination. |

The vault's Overview and Transparency tabs show these rules. The operator's workspace also lists every order the contract refused, with the time and the rule that refused it.

## Permission map

| Who | Can | Cannot |
|---|---|---|
| **Trading key** (operator) | Place and cancel orders within the trading rules | Move funds out of the vault |
| **Operator** | Run the strategy, pay withdrawal requests, trigger an emergency stop | Submit the share value, lift a platform pause |
| **Robonet** (platform) | Pause deposits and trading with a reason, review term changes | Trade, or take investor funds |
| **Investor** | Deposit, withdraw, request, cancel an unpaid request | Change the vault's rules |
| **Anyone** | Start recovery on an overdue request that the vault's cash cannot cover | Trade for the vault |

The full list of roles and keys is in [Security and trust model](/vaults/trust#alpha-vault-roles-and-keys).

## Withdrawals

An investor has two ways out:

- **Withdraw now.** Paid at once from the vault's cash, in one transaction.
- **Request withdrawal.** The vault must pay the request by the service target. The shares stay in the vault and keep their exposure until they are paid. Payments go straight to the investor's wallet. If the vault pays part of a request, the remaining shares stay invested under the original service target.

Read the full rules in [Withdrawals](/vaults/withdrawals).

## Launching an Alpha Vault

1. **Apply** for an operator workspace.
2. **Write the launch terms**: strategy, markets, leverage cap, fees, deposit limits and service window.
3. **Pass the review** of your launch terms.
4. **Complete readiness**: Deploy, Verify contracts, Register and index, Activate. Activate needs your trading connection.
5. **Open deposits.** The vault appears in Discover.

Read the full steps in [Launch a vault](/vaults/launch).

## Is Alpha the right fit?

Alpha fits a strategy that trades on Hyperliquid. If your strategy runs at a centralized exchange or with a custodian, use an [Omega Vault](/vaults/omega).
