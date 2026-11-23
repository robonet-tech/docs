# Omega Vaults

An Omega Vault lets a manager accept on-chain deposits into a strategy that runs at a centralized exchange or with a custodian. The strategy stays where it runs today. The vault adds share accounting, independent valuation reports and withdrawal rules.

| | |
|---|---|
| **Network** | Arbitrum One |
| **Deposit asset** | USDC on Arbitrum One |
| **Network fees** | Paid in ETH |
| **Venue** | Derive. Robonet adds other exchanges and custodians with each operator |
| **Shares** | ERC-4626 |
| **Operator access** | Approved operators who complete KYB (business verification) |

## Who it is for

Funds, trading firms and managers whose strategies run on centralized exchanges or with external custodians.

## What an Omega Vault gives investors

### Disclosed custody

Each vault names who holds the assets: the operator, the exchange or a custodian. Investors know where their capital sits before they invest.

### Independently verified valuation

Registered reporters read the account directly, through access that the operator provides. A report changes the share value only after it reaches quorum, passes its checks and clears a challenge window.

### Automatic pause on stale data

If the accepted report becomes too old, or a qualifying dispute is raised, the vault stops new deposits and stops pricing new withdrawal requests. Pricing opens again only after a fresh report goes through the full acceptance process.

### Standard ERC-4626 shares

Other applications can integrate Omega Vault shares through the standard vault interface. They must take into account when pricing is available and how the claim queue works.

## How reporting works

The share value changes only after a report is accepted.

```
 1. DEPOSIT            2. EXTERNAL TRADING       3. REPORTERS ATTEST          4. ACCEPTED VALUE
 ┌─────────────┐      ┌────────────────────┐    ┌──────────────────────┐     ┌───────────────────┐
 │ investors   │ ───▶ │ operator moves     │ ─▶ │ quorum               │ ──▶ │ challenge window  │
 │ get shares  │      │ capital to the     │    │ account identity     │     │ ends, the report  │
 │ (ERC-4626)  │      │ named exchange or  │    │ permission check     │     │ prices deposits   │
 └─────────────┘      │ custodian          │    │ freshness            │     │ and new requests  │
                      └────────────────────┘    │ value bounds         │     └───────────────────┘
                                                └──────────────────────┘
```

1. **Investors receive shares** when they deposit.
2. **The operator moves capital** to the exchange or custodian named in the vault, and trades there.
3. **Registered reporters read the account.** Each report must reach quorum and pass checks on account identity, the account's permissions, freshness and value bounds.
4. **The report enters a challenge window.** During the window, the report can be disputed. After the window, the accepted value prices deposits and new withdrawal requests.

### Report states

| State | Meaning |
|---|---|
| **Reading** | Reporters are reading the account |
| **Submitted** | A report reached quorum and was submitted |
| **In challenge** | The report is in its challenge window |
| **Accepted** | The report cleared the window. It prices deposits and new requests |
| **Stale** | The last accepted report is older than the vault allows. Deposits and new requests stop |
| **Disputed** | A report was disputed. It is never treated as accepted |

The vault page shows the latest report, its age and the next report in its **Valuation** tab. A fresh reading alone does not restore pricing after a pause. The new report must complete the same acceptance process.

## Withdrawals

- **Withdraw now** is paid at once from the vault's cash (its idle funds), when pricing is fresh.
- **Request withdrawal** books a fixed claim at the last accepted share value. The shares leave your position when the claim is booked. The claim is paid from the vault's cash first, and can be paid in parts. A booked claim cannot be cancelled.
- **If pricing is paused**, claims that were already booked can still be paid from the vault's cash.
- **Escape from idle.** If pricing is closed, a separate path lets investors take their share of the vault's cash. It is not a full recovery: capital held at the venue stays there until the operator returns it.

Read the full rules in [Withdrawals](/vaults/withdrawals).

## Trust model

Know where the trust sits.

| Omega governs | Stays with the venue |
|---|---|
| How the vault is valued | Custody of the assets |
| When pricing is available | Return of capital from the exchange or custodian |
| How withdrawal claims are booked and paid | |

Because custody stays with the venue, Omega Vaults are available only to operators who complete KYB, and every vault discloses its custody arrangement. If the exchange or custodian has a problem, the return of capital depends on that exchange or custodian.

## Launching an Omega Vault

1. **Apply** for an operator workspace and complete KYB.
2. **Write the launch terms**: strategy, custody disclosure, fees, deposit limits and service window.
3. **Pass the review** of your launch terms.
4. **Complete readiness**: Create, Fund and report, Seed once, Open deposits. Fund and report needs your reporting credential.
5. **Open deposits** once the first report is accepted. The vault appears in Discover.

Read the full steps in [Launch a vault](/vaults/launch).

## Is Omega the right fit?

Omega fits a strategy that runs at an exchange or custodian. If your strategy runs fully on Hyperliquid, an [Alpha Vault](/vaults/alpha) enforces your trading and withdrawal rules in the contract.
