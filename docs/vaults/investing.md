# Invest in a vault

This page is for investors. It explains how to find a vault, how to read it and how to invest. To take money out, see [Withdrawals](/vaults/withdrawals).

## What you need

| Vault model | Network | Deposit asset | Network fee coin |
|---|---|---|---|
| Alpha | HyperEVM | USDC on HyperEVM | HYPE |
| Omega | Arbitrum One | USDC on Arbitrum One | ETH |

You also need a browser wallet. The app does not bridge or move USDC between networks. If your USDC is on another network, move it to the vault's network first. The invest dialog tells you where your USDC is.

::: tip You can read everything without a wallet
Discover, every vault page and every public vault link open without a wallet. The app asks for your wallet only when you take an action that needs it, and it tells you why.
:::

## Find a vault

**Discover** lists every vault that has opened deposits. You can search, filter by model, venue and status, and sort by any column.

Each row shows:

| Column | What it tells you |
|---|---|
| Name and model badge | The vault and whether it is Alpha or Omega |
| Network | Where the vault lives |
| Strategy | A short tag for what the strategy does |
| Custody | Who holds the assets |
| Risk | A one-line risk summary |
| Share value | What one share is worth now |
| Return | The return for the selected period |
| Deposits | Open, paused or closed |
| Minimum deposit | The smallest amount you can invest |
| Total fee | Everything you pay, as one number |

If a figure is not available, the row says "unavailable" with the time of the last good value. It never shows zero in its place.

## Read a vault page

Each vault page has a header, five tabs and a **Your position** panel.

### Header

The header shows the name, model, network and contract address. Three status chips tell you the state of the vault:

| Chip | Values |
|---|---|
| **Deposits** | Open, paused, closed |
| **Pricing** (Omega) | Fresh, stale, frozen |
| **Lifecycle** | Open, recovery, closed |

One line under the header says which withdrawal paths are open now. If Robonet paused the vault, the header says so and shows the reason.

### Tabs

| Tab | What you find there |
|---|---|
| **Overview** | The strategy (venues, leverage cap, maximum drawdown target, withdrawal paths), a performance summary, the total fee, the deposit policies and any approved term change with the date it applies |
| **Performance** | Share value, net profit and loss and return over 1D, 1W, 1M, 3M, YTD and All, plus drawdown. Each chart states its basis, for example "after fees, since inception". You can download the series as CSV |
| **Transparency** | What the operator can and cannot do. Alpha: the permission map and the recovery rule. Omega: who holds custody, the reporters and the report timeline. Also the fees, the risks, the contract release and its [audit status](/vaults/audits) |
| **Withdrawals** | Your requests on this vault, with their stage |
| **Activity** | Your transactions on this vault, each linked to the block explorer |

A vault younger than seven days shows "not enough history" instead of a performance curve.

### Your position

The panel next to the tabs shows your shares, their value, your net profit and loss and any pending withdrawal. Its main button changes with your state: **Invest**, **Switch network**, **Claim** or **Initiate recovery**.

## Invest

Press **Invest** on a vault page. The first time, the app takes you through four short steps:

1. **Connect** your wallet.
2. **Sign in** by signing a message. The app shows the message before you sign. Signing in costs no fee.
3. **Accept the terms.** You accept once per wallet. If the terms change, the app asks again before your next signed action.
4. **Complete verification**, only if this vault requires it. The vault page tells you before you start.

Then:

1. **Read the limits.** The dialog shows the minimum and the maximum before you type. The maximum is the lowest of your USDC on the vault's network, the vault's remaining capacity and the per-wallet cap. The dialog tells you which one applies.
2. **Enter an amount.**
3. **Read the quote.** It shows the amount, the estimated shares, the share value you enter at, and the total fee. On Omega, the quote names the accepted report it uses.
4. **Switch network** if the app asks. Nothing is sent until your wallet is on the vault's network.
5. **Approve and deposit.** You approve exactly the amount you deposit, then sign the deposit.
6. **Wait for confirmation.** The confirmation shows the shares you received and the share value you paid. Your position appears in **Portfolio**.

If the price moves before you sign, the dialog goes back to the review and shows both figures. If you close the dialog, the transaction keeps running and stays in the transaction tray.

### Why a deposit can be blocked

The dialog names the reason and the next step. Common reasons:

| Reason | What to do |
|---|---|
| Below the minimum | Enter a higher amount |
| Over your wallet cap, or the vault is full | Enter a lower amount |
| Deposits paused or closed | You can still withdraw. Check the header for the reason |
| Pricing stale or frozen (Omega) | Wait for a fresh accepted report. The header shows its date |
| You have an open withdrawal request on this vault (Alpha) | Wait until the request is paid, or cancel it |
| Verification required | Complete verification from the vault page |
| Wrong network | Press **Switch network** |
| No coin for the network fee | Get HYPE (Alpha) or ETH (Omega) on the vault's network |

If you have a request that is ready to claim, you can always claim it, whatever blocks deposits.

## Fees

A vault can charge these fees. The operator sets them in the launch terms, and Robonet reviews them.

| Fee | Charged on |
|---|---|
| **Management fee** | The vault's assets, over time |
| **Performance fee** | Profit above the high-water mark |
| **Volume fee** (Omega) | Trading volume |
| **Platform fee** | A fixed part that goes to Robonet |

You do not need to add these up. Discover, the vault page and every quote show **one total fee**: what you pay as an investor. A change to the fees of a live vault goes through a [term change](/vaults/trust#term-changes), and you are told before it applies.

## Portfolio, activity and account

- **Portfolio** shows your total value (positions plus claimable withdrawals), net profit and loss, net contributions, allocation by vault and model, your positions, pending withdrawals and recent activity. You can download your positions as CSV.
- **Activity** lists your events across all vaults. Pending actions are kept separate from confirmed events. You can download the full list as CSV.
- **Account** shows your wallet, your session, the networks you use, the version of the terms you accepted, your verification status and your notification settings.

## Notifications

The app always shows notifications in the bell. You can also opt in to email for these events:

- A withdrawal is ready to claim
- A withdrawal is overdue
- Pricing on a vault you hold went stale
- A term change was approved on a vault you hold

## Share a vault

Every vault has a public link in the form `/vaults/<network>/<address>`. The link opens the vault page without a wallet. Press **Copy public link** on the vault page.
