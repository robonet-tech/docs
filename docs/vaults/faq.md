# Vaults FAQ

## Investors

### Does Robonet hold my funds?

No. On an Alpha Vault, the vault contract holds the assets, and the operator's trading key cannot move them out. On an Omega Vault, the assets are held by the operator, exchange or custodian named on the vault page.

### Do I need a wallet to look at vaults?

No. Discover, the vault pages and public vault links open without a wallet. The app asks you to connect only when you invest or withdraw.

### Which networks and assets do I need?

Alpha Vaults use USDC on HyperEVM, with HYPE for network fees. Omega Vaults use USDC on Arbitrum One, with ETH for network fees. The app does not bridge. Move your USDC to the vault's network first.

### What fees do I pay?

Every vault shows one total fee: everything you pay as an investor. It is made of the operator's fees and a fixed platform part. See [Fees](/vaults/investing#fees).

### How fast can I withdraw?

**Withdraw now** pays at once if the vault has enough cash. Otherwise, **Request withdrawal**, and the vault must pay you by the service target shown on the vault page. See [Withdrawals](/vaults/withdrawals).

### What if the operator does not pay my request on time?

On an Alpha Vault, anyone can start recovery once the request is overdue and the vault's cash cannot cover it. On an Omega Vault, the request is paid from the vault's cash when there is cash, and the operator must return capital from the venue. See [When a request is overdue](/vaults/withdrawals#when-a-request-is-overdue).

### Can I cancel a withdrawal request?

On an Alpha Vault, yes, while nothing has been paid on it. On an Omega Vault, no: a booked claim cannot be cancelled.

### Can the operator change the fees after I invest?

Only through a term change. Robonet reviews it, it applies after a delay, and you are told before it applies. You can withdraw before then.

### Do I need to verify my identity?

Only if the vault's policy requires it. The vault page tells you before you start.

## Operators

### Who can launch a vault?

Approved operators. You apply for a workspace, and Robonet reviews it. Omega operators also complete KYB. See [Launch a vault](/vaults/launch).

### Which model should I choose?

[Alpha](/vaults/alpha) if your strategy trades on Hyperliquid. [Omega](/vaults/omega) if it runs at a centralized exchange or with a custodian.

### Can I set my own withdrawal service window?

Yes. The service window is part of your launch terms.

### Which exchanges and custodians does Omega support?

Omega supports Derive. Robonet adds other exchanges and custodians with each operator. [Contact the team](mailto:support@robonet.finance) about your venue.

### Can other applications integrate vault shares?

Yes. Shares follow the ERC-4626 standard. Integrations on Omega must take into account when pricing is available and how the claim queue works.

### Can I stop my vault in an emergency?

Yes. The emergency stop pauses the vault, cancels open orders and closes positions. Withdrawals stay open. See [Emergency stop](/vaults/operate#emergency-stop).

### Can I use the quant engine to build my strategy?

Yes. The [quant engine](/guide/) builds, backtests and optimizes strategies through your AI coding agent. The vault is where the strategy takes investor capital.
