# Glossary

Terms used in Robonet Vaults.

| Term | Meaning |
|---|---|
| **Alpha Vault** | A vault model for strategies that trade on Hyperliquid. The contract holds the assets and enforces the trading rules |
| **Omega Vault** | A vault model for strategies held at a centralized exchange or custodian. Registered reporters verify the share value |
| **Vault model** | Alpha or Omega. Every vault shows its model badge |
| **Operator** | The approved team that runs a vault |
| **Investor** | A wallet that holds or buys vault shares. Also called a depositor |
| **Platform reviewer** | Robonet staff who approve workspaces and launch terms, supervise live vaults and can pause deposits |
| **Workspace** | An operator team's space in the app. Also the three areas of the app: investor, operator and platform reviewer |
| **Share value** | What one vault share is worth. Also called the share price |
| **Vault's cash** | USDC in the vault contract that is not allocated to the strategy. Also called idle funds |
| **Alpha engine** | The audited contracts that every Alpha Vault runs. See [Audits](/vaults/audits) |
| **Launch terms** | A vault's strategy, disclosures, fees and policies, as the operator submits them for review |
| **Readiness** | The checklist that makes an approved vault live |
| **Withdraw now** | A withdrawal paid from the vault's cash in one transaction |
| **Request withdrawal** | A withdrawal the vault must pay by its service target. Its stages are Requested, Awaiting liquidity, Ready to claim and Claimed |
| **Claim** | The last stage of a request: receiving money that is set aside for you |
| **Service target** | The time by which the vault must pay a request. Also called the withdrawal deadline. The operator sets the **service window** in the launch terms |
| **Overdue** | A request that is past its service target and not paid in full |
| **Recovery** | On Alpha: the process that anyone can start to unwind an overdue vault and pay its requests |
| **Escape from idle** | On Omega: a path to take your part of the vault's cash while pricing is closed. It is not a full recovery |
| **Valuation report** | On Omega: a value signed by reporters. Its states are Reading, Submitted, In challenge, Accepted, Stale and Disputed |
| **Challenge window** | The time during which a submitted Omega report can be disputed, before it is accepted |
| **Trading key** | On Alpha: the key the operator trades with. It can place and cancel orders, and cannot move funds out |
| **Trading rules** | On Alpha: the market whitelist, price band, leverage cap and destination lock |
| **Term change** | A reviewed change to a live vault's fees or policies. It applies after a delay |
| **Verification** | KYC for people, KYB for businesses. Status: not started, pending, verified or failed |
| **Region block** | A server decision, made before any wallet step, that blocks actions from some regions |
| **Platform pause** | Robonet pauses a vault's deposits with a reason. Only Robonet can lift it |
| **Emergency stop** | A pause plus cancelling orders and closing positions |
| **Lock-up** | A period after a deposit during which Withdraw now is not available |
| **High-water mark** | The highest share value on which a performance fee was paid. A performance fee applies only to profit above it |
| **ERC-4626** | The standard interface for tokenized vaults. Robonet Vault shares follow it |
