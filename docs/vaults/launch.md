# Launch a vault

This page is for operators: strategy teams that want to run a Robonet Vault. Launching takes two approvals from Robonet and a readiness checklist.

```
 APPLY ──▶ workspace approved ──▶ LAUNCH TERMS ──▶ terms approved ──▶ READINESS ──▶ OPEN DEPOSITS
           (first approval)       (5 steps)        (second approval)  (checklist)    (listed in Discover)
```

## Before you start

- **Choose a model.** [Alpha](/vaults/alpha) if your strategy trades on Hyperliquid. [Omega](/vaults/omega) if it runs at an exchange or custodian.
- **Omega operators complete KYB**, a verification of the business. Robonet verifies operators before any Omega Vault is deployed.
- **Have the venue access ready.** Alpha needs a trading connection to Hyperliquid. Omega needs a read-only reporting credential for the account that holds the strategy.

## 1. Apply

Open the operator workspace. Connect your wallet, sign in and accept the terms. Then fill in the application:

- Workspace name
- Operating contact
- Intended vault model
- Venue, or where the assets are held
- Strategy description
- Expected vault size
- Consent to support contact

The application saves as a draft. You can sign out and come back. When you submit, the application locks.

### Application status

| Status | What it means |
|---|---|
| **Submitted** | Robonet is reviewing your application |
| **Changes requested** | The reviewer left a note. Edit the application and submit again |
| **Approved** | Press **Open your workspace** |
| **Rejected** | You keep read access. You cannot resubmit |
| **Suspended** | Access is suspended. You keep read access |

This is the **first approval**: access to an operator workspace.

## 2. Write the launch terms

In your workspace, press **New vault**. The editor has five steps. Your draft saves at every step.

| Step | What you set |
|---|---|
| **1. Model** | Alpha or Omega. The model locks once the draft exists |
| **2. Strategy and disclosures** | Name, symbol, description, venues, leverage cap, target maximum drawdown, minimum deposit, capacity, lock-up or notice period. Omega: who holds custody |
| **3. Fees** | Your fee legs (management, performance and, on Omega, volume) and the recipient. The platform's part is fixed. The editor shows the **total fee investors will pay** and a preview of what investors will see |
| **4. Policies** | Verification to deposit, whitelist, per-wallet cap, deposit cap, lock-up, service window and region restrictions |
| **5. Review and submit** | Every term, and your confirmation that the terms are accurate |

Fee values above the platform's ceilings cannot be saved. A per-wallet cap above the vault's deposit cap is refused.

The **service window** sets the service target for every withdrawal request: how long the vault has to pay it. Choose a window that your strategy can meet.

## 3. Pass the launch review

Robonet reviews your launch terms next to "what investors will see". This is the **second approval**. It is separate from the approval of your workspace.

- **Approved.** The vault moves to readiness.
- **Changes requested.** The editor opens again, with the reviewer's note in the step it refers to. Your resubmission is a new version.

Approving terms does not deploy anything. Until readiness is complete, the vault reads "approved, not launched" everywhere.

## 4. Complete readiness

Each model has its own checklist. Each item reads done, current, or blocked with a named reason and a link to fix it. You must complete the steps in order.

### Alpha Vault readiness

| Step | What happens |
|---|---|
| **Deploy** | You sign the deployment of the vault contracts on HyperEVM |
| **Verify contracts** | Robonet verifies the deployed contracts, so anyone can read them on the block explorer |
| **Register and index** | Robonet registers the vault and starts indexing its events |
| **Activate** | The vault starts trading. Needs your trading connection |

### Omega Vault readiness

| Step | What happens |
|---|---|
| **Create** | You sign the creation of the vault on Arbitrum One |
| **Fund and report** | Reporters read your account. Needs your reporting credential |
| **Seed once** | You make the first deposit into the vault |
| **Open deposits** | Allowed once the first report is accepted |

### Common blocking reasons

- A connector is missing, revoked or connected to the wrong account
- Not enough coin for the network fee
- A check is out of date and must run again
- A shared-wallet approval is not signed yet
- Omega: reporters have not reached quorum, or the last report is stale

Fix the reason, and the step unblocks on the next check.

If a signed step is interrupted, it resumes without a second broadcast. "Contracts deployed, setup incomplete" is a real state, and the app shows it as such.

## 5. Open deposits

The last step runs a fresh check and opens the vault to investors. The vault now appears in **Discover**. Next, read [Run a vault](/vaults/operate).

## Questions

**Can I launch with a shared wallet?** Yes. A workspace can sign through a shared wallet (Safe). Each signed step then becomes a pending approval that your signers complete in the wallet's own app.

**Can I change my terms after launch?** Yes, through a reviewed [term change](/vaults/operate#change-the-terms-of-a-live-vault) that applies after a delay.

**Do I need an engineer to launch?** No. Every step runs from the app.
