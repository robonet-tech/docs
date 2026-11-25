# Audits

This page lists the external audits of the Robonet Vaults contracts. It tells you what each audit covers and how to check the audit status of a vault.

## Hashlock audit of the Alpha engine

[Hashlock](https://hashlock.com), an independent smart contract security firm, audited the Alpha engine. The Alpha engine is the set of contracts that every Alpha Vault runs on HyperEVM.

| | |
|---|---|
| **Auditor** | Hashlock |
| **Scope** | The Alpha Vault contract, its libraries and the vault registry |
| **Completed** | September 2026 |
| **Result** | No critical findings |

### What the audit covers

- **Trading permissions.** The trading key can place and cancel orders, and has no path to move funds out of the vault.
- **Trading rules.** The market whitelist, the price band, the leverage cap and the destination lock.
- **Share value.** The calculation from on-chain balances and the vault's HyperCore account.
- **Deposits, fees and withdrawals.** Share pricing on entry and exit, the fee calculation, the withdrawal queue and payments.
- **Recovery.** The path that anyone can start when a withdrawal request is overdue.

### What the audit does not cover

- **Omega Vaults.** They run on separate contracts on Arbitrum One.
- **Off-chain software.** The Robonet Vaults app, the indexer and the automated services are not part of the audit.
- **Strategies.** An audit checks the contract code. It does not check whether a strategy is profitable.

## New vault types do not change the audited engine

Earn, Liquidity and Hybrid vaults are in development. Each one will ship as a separate contract, so the audited Alpha engine does not change. A new contract shows its own audit status.

## Check the audit status of a vault

Open the vault page and select the **Transparency** tab. It shows:

- The contract release that the vault runs
- The audit status of that release
- Links to the contracts on the block explorer, where anyone can read the verified code

If no audit applies to the vault's release, the tab says "no audit on file".

## Testing

Robonet has tested recovery on mainnet with real funds. A wallet with no role in the vault ran it. See [Recovery](/vaults/withdrawals#recovery-alpha).

## An audit is not a guarantee

Contracts can have bugs, even after an audit. Read the risks in [Security and trust model](/vaults/trust#risks) before you invest.
