# Withdrawals

Every Robonet Vault gives investors a defined path back to their money. This page explains the paths, the stages of a request and what happens when a request is late.

## Two ways out

Press **Withdraw** on a vault page. The dialog first quotes your whole position. Then it tells you which path is open now, before you enter an amount.

| Path | When you can use it | What happens |
|---|---|---|
| **Withdraw now** | The vault has enough cash and a current share value | You receive USDC in one transaction. The dialog shows the gross amount, any fee and the net amount |
| **Request withdrawal** | At any time, except on an Omega Vault while its pricing is stale or closed | The vault must pay you by the **service target**. Payment can come in parts |

If the vault's cash covers only part of your amount, the dialog offers **Withdraw now** for the part it covers and **Request withdrawal** for the rest.

If no path is open, the dialog says why and until when. For example: Omega pricing that is closed, or no shares to withdraw.

::: info Paused and closed vaults
A pause stops new deposits. A closed vault takes no new deposits ever again. In both cases, withdrawals keep working.
:::

## The stages of a request

| Stage | Meaning |
|---|---|
| **Requested** | Your request is confirmed on chain |
| **Awaiting liquidity** | The vault has not yet set aside money for your request |
| **Ready to claim** | Money is set aside for your request, in full or in part |
| **Claimed** | You were paid in full |

The stage comes from the chain, never from what the operator says it will do. A request past its service target shows **Overdue**, with the date it was due.

You can follow every request on the **Withdrawals** page, across all vaults. Each row shows the amount requested, the amount paid so far, the amount still owed, the service target and the network. You can download the list as CSV.

## Requests on an Alpha Vault

- **Your shares stay invested.** When you make a request, your shares move into the vault's escrow but keep their exposure to the strategy. They are priced when they are paid, not when you make the request.
- **Payments go straight to your wallet.** The vault pays as cash becomes available. Payment can come in parts. After a part payment, the remaining shares stay invested and keep the original service target.
- **Performance fee.** The performance fee rate is fixed at the moment you make the request. The fee is taken from your payout, so investors who stay are not diluted.
- **One request per vault.** You can have one open request on a vault. While it is open, you cannot add to your position on that vault.
- **Cancel.** You can cancel a request while nothing has been paid on it. Your shares return to your position.

## Requests on an Omega Vault

- **A fixed claim.** Your request books a claim at the **last accepted share value**. The shares leave your position when the claim is booked. Nothing is paid at booking.
- **Paid from cash first.** The claim is paid from the vault's cash (its idle funds), and can be paid in parts. Capital at the exchange or custodian comes back through the operator.
- **Claim.** When money is set aside, the request shows **Ready to claim**. Press **Claim** to receive it. After a part payment, the request returns to **Awaiting liquidity** and shows what was paid.
- **No cancel.** A booked claim cannot be cancelled. The review tells you this before you sign.
- **Stale pricing.** While pricing is stale or frozen, new requests are blocked. A claim that is already **Ready to claim** still pays.

## When a request is overdue

### Recovery (Alpha)

On an Alpha Vault, a late request does not depend on the operator.

1. **The request passes its service target.** Anyone can then mark it as overdue. The vault sets aside its available cash for that request before anything else.
2. **The cash still does not cover it.** After a short grace period, **anyone** can start recovery. This includes an address that holds no shares.
3. **Recovery runs.** New trading stops. Anyone can then take a limited set of steps: cancel open orders, close positions and bring the money back to the vault.
4. **The request is paid.** As money arrives, requests move to **Ready to claim** and are paid in order.

```
 service target passes ──▶ overdue: cash set aside first
                                   │
                      cash does not cover the request
                                   │  (after a grace period)
                                   ▼
               anyone starts recovery ──▶ cancel orders ──▶ close positions
                                                                  │
                         requests are paid in order ◀── money returns to the vault
```

Recovery is not a claim. It closes the vault to deposits and unwinds the strategy. It settles at market prices and depends on the liquidity available in the market.

Robonet has tested recovery on mainnet with real funds. A wallet with no role in the vault ran it.

### Late requests on an Omega Vault

On an Omega Vault, a late request is paid from the vault's cash when there is cash. The operator must return capital from the exchange or custodian. The request page shows that the claim is overdue and offers **Get help**, with the request attached.

### Escape from idle (Omega)

If an Omega Vault's pricing is closed, both normal paths are blocked. A separate **Escape from idle** path appears. It burns your shares and pays you your part of the vault's cash at a floor price. The review shows the conditions, the shares burned and the payout.

Escape from idle is not a full recovery. Capital held at the exchange or custodian stays there until the operator returns it.

## Lock-up

A vault can have a lock-up. During the lock-up, **Withdraw now** is not available for your deposit. **Request withdrawal** stays available. The Withdraw dialog shows when the lock-up ends.
