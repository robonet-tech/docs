# Run a vault

This page is for operators with a live vault. It explains the operator workspace and the actions you take day to day.

## Workspace overview

The workspace home shows, across all your vaults:

- Value across vaults
- Number of investors
- Fees accrued this period
- Liquidity coverage against open withdrawal requests
- Open withdrawal requests and alerts
- Items under review and pending approvals
- Recent activity

Every figure comes from the server. If a figure is not available, the app says "unavailable".

## The vault page

| Tab | What you do there |
|---|---|
| **Overview** | Health, warnings (credential problems, stale pricing, short liquidity, a platform pause with its reason) and recent activity |
| **Performance** | Share value, net profit and loss, return and drawdown, with CSV download |
| **Transparency** | The published disclosures. Investors and reviewers see exactly the same block |
| **Capital** | The vault's cash and the capital at the venue, transfers in progress and coverage against pending withdrawals |
| **Valuation** (Omega) | The report timeline, its freshness and the reporters |
| **Withdrawals** | The request queue for this vault |
| **Investors** | Holders, their shares and their pending withdrawals |
| **Fees** | Fees accrued, crystallised and paid out, by leg and recipient, with the high-water mark |
| **Activity** | Every event, with block, time and network |
| **Settings and governance** | The current terms, term changes, and the roles that control the vault |

Most tables can be filtered and downloaded as CSV.

## Pay withdrawal requests

Your main duty to investors is to pay every request by its service target.

The **Withdrawals** view shows each request with its stage, investor, amount, service target and amount paid so far. Above the queue, a **liquidity needed** total tells you how much cash the vault needs to cover what is due.

- **Alpha.** Keep enough cash in the vault. Requests are paid from the vault's cash, and payments go straight to the investor. If a request goes overdue and the cash cannot cover it, anyone can start [recovery](/vaults/withdrawals#recovery-alpha).
- **Omega.** Return capital from the exchange or custodian to the vault, so that claims can be paid from its cash. Then the investor claims.

Funding a request never counts as paid. A request is paid only when the money reaches the investor.

## Manage capital

The **Capital** tab shows two boxes: the vault's cash and the capital at the venue. Use **Allocate** to send capital to the strategy and **Return capital** to bring it back. Funds move only through the contract actions shown in the dialog.

- **Alpha.** Funds move only between the vault and its own Hyperliquid account.
- **Omega.** The dialog shows which steps happen at the exchange and which ones the vault reconciles. A transfer that the vault cannot match reads "unmatched" until it is reconciled.

## Valuation (Omega)

The **Valuation** tab and the top-level **Valuation** page show each Omega Vault's pricing state, the last accepted report and its age, the report in progress and its challenge window, and the reporters with their bonds.

Acceptance is the reporters' process. There is no operator control to accept a report. Keep your reporting credential valid: if it expires or is revoked, reports stop and pricing goes stale.

## Risk limits and refused orders

The vault's limits are on its Overview and Transparency tabs. On Alpha, these are the market whitelist, the price band, the leverage cap and the destination lock. The workspace keeps a record of every order the contract refused, with the time, the rule and what was refused.

## Alerts

Alerts tell you what happened, what it affects and what to do next, with a link to the affected tab. Examples:

- A withdrawal request is close to its service target
- An Omega report entered its challenge window, or went stale
- A credential is about to expire
- Liquidity does not cover pending requests

Acknowledging an alert is not the same as resolving it. An acknowledged alert does not turn a health indicator green.

## Emergency stop

If keys are compromised or your systems fail, trigger an **emergency stop** on your vault. It pauses the vault, cancels open orders and closes positions. Withdrawals stay open.

The header, Overview and Activity record who triggered the stop, when and why. Lifting the stop is a separate action, and it is also recorded.

::: warning A pause alone is not a safe place to stop an Alpha Vault
On an Alpha Vault, a pause stops new orders, including orders that only reduce a position. Open positions stay exposed to the market until they are closed. This is why the emergency stop pauses and closes in one action.
:::

## Platform pause

Robonet can pause a vault's deposits, with a reason. You see the reason on the vault page. You cannot lift a platform pause. Only Robonet can. Withdrawals stay open during a platform pause.

## Change the terms of a live vault

You can change a live vault's fees and policies with **Propose change** in **Settings and governance**.

1. **Propose the change.** Fee values above the platform's ceilings cannot be entered.
2. **Robonet reviews it.** The reviewer approves it or requests changes.
3. **The delay runs.** The change executes after the contract's delay. The page shows the date and time it will apply. A fee increase carries a longer notice.
4. **Investors are told** when the change is approved and when it executes. They can withdraw before it applies.

You can have one change in flight per vault. You can cancel a change before it executes.

## Close a vault

The workspace owner can close a vault. Closing is permanent: the vault takes no new deposits, and any term change in flight is cancelled. Withdrawals keep working. Closing starts the wind-down: return the capital, pay every claim, then the vault reads **Closed**.

## Team, connectors and access

### Roles

| Role | Can |
|---|---|
| **Owner** | Everything, including inviting members, changing roles and closing vaults |
| **Operator** | Run vaults and create API keys for their own role |
| **Viewer** | See every screen. Cannot take any action |

Invitations expire after seven days. The last owner of a workspace cannot be removed.

### Connectors

Connectors link your workspace to venues. A connected venue shows its alias, its scope (read-only or trading), the credential status and the vaults that depend on it.

- Robonet never asks for a seed phrase or a private key.
- Secrets are never shown back to you after you enter them.
- A read-only connection never enables trading.
- Rotating or revoking a credential applies on the next check.

### API keys

Create API keys for programmatic access. A key's scope is never wider than your role. The secret is shown once. You can see when a key was last used, and revoke it at any time.

### Shared wallets

A workspace can sign through a shared wallet (Safe). Each signed action then becomes a pending approval: proposed, collecting signatures, ready, executed. Before it executes, the app checks the vault again. If the vault changed, the action is marked "not executed".

## Notifications

You get in-app notifications, and email if you opt in, for application and launch decisions, changes requested, overdue withdrawals, stale pricing, expiring credentials, approved and executed term changes, and approvals ready to sign.
