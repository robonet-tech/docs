# Robonet Vaults

Robonet Vaults let a strategy team accept capital from investors under rules that the team cannot change on its own. Investors deposit USDC and receive vault shares. The team trades. The vault records who owns what, how the shares are valued and how investors get their money back.

There are two vault models. Each vault uses one of them.

| | Alpha Vault | Omega Vault |
|---|---|---|
| **For** | Strategies that trade on chain | Strategies held at a centralized exchange or custodian |
| **Trades on** | Hyperliquid | The exchange or custodian named in the vault |
| **Network** | HyperEVM | Arbitrum One |
| **Who holds the assets** | The vault contract | Disclosed on each vault: the operator, the exchange or a custodian |
| **Share value comes from** | On-chain balances and the vault's Hyperliquid account | Valuation reports from registered reporters, accepted after a challenge window |
| **Operator can move funds out** | No. The trading key can only place and cancel orders | Capital moves to the venue named in the vault |
| **If a withdrawal is overdue** | Anyone can start recovery | Claims are paid from the vault's cash; the operator must return capital |
| **Operator access** | Approved operators | Approved operators after KYB |

[Alpha Vaults →](/vaults/alpha) · [Omega Vaults →](/vaults/omega)

## How a vault works

```
   INVESTOR                     VAULT                          OPERATOR
 ┌───────────┐   USDC in    ┌──────────────────┐   trades   ┌─────────────┐
 │  Invest   │ ───────────▶ │  ERC-4626 shares │ ◀────────▶ │  Strategy   │
 │           │ ◀─────────── │  share value     │            │  team       │
 │  Withdraw │  USDC out    │  withdrawal rules│            └─────────────┘
 └───────────┘              └──────────────────┘
                                     ▲
                                     │ two approvals, supervision, pause
                              ┌──────────────┐
                              │   Robonet    │
                              │  (platform   │
                              │   review)    │
                              └──────────────┘
```

1. **An operator applies.** Robonet reviews the team and approves its workspace.
2. **The operator writes launch terms.** Strategy, disclosures, fees and policies. Robonet reviews the terms separately and approves them.
3. **The operator makes the vault ready.** The app gives a checklist for each model. When every step is done, the operator opens deposits and the vault appears in Discover.
4. **Investors invest.** They deposit USDC and receive shares. The share value goes up and down with the strategy.
5. **Investors withdraw.** They take money out at once from the vault's cash, or make a request that the vault must pay by its service target.

Both models issue standard ERC-4626 shares, so other applications can integrate them.

## The Robonet Vaults app

One app serves everyone. It has three workspaces:

| Workspace | Who uses it | What they do there |
|---|---|---|
| **Investor** | Anyone with USDC | Browse vaults without a wallet, invest, withdraw, track requests, see the portfolio |
| **Operator** | Approved strategy teams | Apply, write launch terms, prepare and open vaults, run them day to day |
| **Platform reviewer** | Robonet staff | Approve workspaces and launch terms, supervise live vaults, pause with a reason |

A wallet that has more than one role switches workspace from the account menu. Switching gives no extra permissions. The server checks every action against the wallet's role.

## What Robonet guarantees

- **Rules are in the contract.** Trading limits, the share value source and the withdrawal rules are enforced on chain. The app shows them. It does not create them.
- **Two separate approvals.** Approving an operator and approving a vault's terms are two decisions. An approved vault is not live until its readiness checklist is complete.
- **Exits stay open.** A pause stops new deposits. A closed vault takes no new deposits. In both cases, investors can still withdraw.
- **No invented numbers.** The app shows only figures that the chain or the indexer confirms. If a figure is not available, the app says so. A transaction shows as complete only after it is confirmed on chain.
- **Changes are visible before they apply.** A change to a live vault's fees or policies is reviewed by Robonet and applies only after a delay. Investors are told, and can withdraw before the change applies.

Read the details in [Security and trust model](/vaults/trust).

## Where to start

<div class="flex">
<div class="box">

### Investors

Find a vault, read what the operator can and cannot do, then invest.

[Invest in a vault →](/vaults/investing)

[How withdrawals work →](/vaults/withdrawals)

</div>
<div class="box">

### Operators

Apply, set your launch terms and open your vault to investors.

[Launch a vault →](/vaults/launch)

[Run a vault →](/vaults/operate)

</div>
</div>

## For chains and trading venues

Robonet works with chains and venues that want vaults on their ecosystem. This can include a branded vault app, adapters for your venues, and support for the apps that build on you. Robonet can host it, embed it in your product, or give you the parts to run it yourself.

Contact the team at [support@robonet.finance](mailto:support@robonet.finance).
