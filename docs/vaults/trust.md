# Security and trust model

This page explains the roles and permissions in a Robonet Vault, which rules the contract enforces, and which risks remain.

## Principles

1. **Rules live in the contract.** Trading limits, the share value source and the withdrawal rules are enforced on chain. The app shows the rules. It cannot change them.
2. **Two separate approvals.** Robonet approves an operator's workspace, and separately approves each vault's launch terms. Approving terms is never a deployment.
3. **Exits stay open.** Pausing or closing a vault stops new deposits. Investors can still withdraw.
4. **Nothing is invented.** The app shows only figures that the chain or the indexer confirms. A transaction is shown as complete only after it is confirmed. If something is unknown, the app says it is unknown.
5. **One network per vault.** Reading a vault never depends on your wallet's network. Signing does. The app refuses a transaction on the wrong network before your wallet is asked to sign.
6. **Every platform decision is logged.** Robonet logs each reviewer action: who did it, what it was, which vault, the result and the time.

## Alpha Vault roles and keys

| Role | Held by | Can | Cannot |
|---|---|---|---|
| **Trading key** | The operator | Place and cancel orders within the trading rules, move funds between the vault and its own Hyperliquid account | Send funds to any other address, change the rules, submit the share value |
| **Keeper** | Robonet's automated service | Pay withdrawal requests and run the vault's routine operations, with the same limits as the trading key | Send funds to any other address, change the rules |
| **Emergency key** | Robonet, on hardware | Pause, cancel orders, close positions, shut the vault down for good | Change the vault's terms |
| **Governance** | A timelock controlled by Robonet | Change the vault's terms, after the delay | Skip the delay |
| **Anyone** | Any address | Mark an overdue request, and run recovery once its condition is met | Trade, or recover before the condition is met |

The operator's **emergency stop** can pause the vault, cancel orders and close positions within the price band. It cannot lift a pause, force-close at any price or shut the vault down. Those actions stay with Robonet's emergency key.

## Omega Vault roles

| Role | Can |
|---|---|
| **Operator** | Move capital to and from the exchange or custodian named in the vault |
| **Reporters** | Read the account and submit signed valuation reports. Reporters post a bond |
| **Governance** | Change the vault's terms, after the delay |

On an Omega Vault, the venue holds the assets. The contract governs valuation, pricing availability and how withdrawal claims are booked and paid. It cannot force the venue to return capital.

## Pause, stop and close

| Action | Who | What stops | What keeps working |
|---|---|---|---|
| **Platform pause** | Robonet, with a reason | New deposits. On Alpha, also new orders | Withdrawals and claims |
| **Emergency stop** | The operator, or Robonet | New deposits and new orders. Open orders are cancelled and positions closed | Withdrawals and claims |
| **Close** | The workspace owner | New deposits, permanently. Term changes in flight are cancelled | Withdrawals and claims |
| **Pricing stale or disputed** (Omega) | Automatic | New deposits and new withdrawal requests | Claims that are already booked |

The operator cannot lift a platform pause. A paused vault still pays withdrawals.

## Term changes

A change to a live vault's fees or policies follows the same path every time:

1. The operator proposes it.
2. Robonet reviews it.
3. It executes after the contract's delay. The vault page shows the date and time. A fee increase carries a longer notice.
4. Investors are told when it is approved and when it executes. The vault page shows the change with a link to withdraw before it applies.

There is one change in flight per vault.

## Verification and regions

Each vault has a policy. The policy says whether investors must verify their identity before they deposit, and whether the vault has a whitelist. A vault without a verification policy never asks you to verify.

The region check runs on the server before any wallet step. If the check cannot answer, the app stays open for reading and blocks every action that signs or moves money until it can.

## Audits

Hashlock audited the Alpha engine, the contracts that every Alpha Vault runs, and found no critical issues. Every vault's **Transparency** tab shows the audit status of its deployed release, with links to the contracts on the block explorer. If no audit applies to a vault's release, the tab says "no audit on file".

Read what the audit covers in [Audits](/vaults/audits).

## Risks

Read the Transparency tab of each vault before you invest. These risks apply to Robonet Vaults:

| Risk | What it means |
|---|---|
| **Strategy risk** | The strategy can lose money. Past performance does not predict future results |
| **Liquidity risk** | A request can take until its service target to be paid. On Alpha, recovery settles at market prices and depends on the liquidity in the market |
| **Venue and custody risk** (Omega) | The exchange or custodian holds the assets. The return of capital depends on it |
| **Valuation risk** (Omega) | The share value depends on reporters. A stale or disputed report pauses deposits and new requests |
| **Smart contract risk** | Contracts can have bugs, even after an audit |
| **Network risk** | A network outage can delay transactions |
