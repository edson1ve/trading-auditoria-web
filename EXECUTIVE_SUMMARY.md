# Executive Summary - Risk and Operating Limits

Generated: 2026-02-20

## Objective
Provide an investor-facing summary of real operating risks and recommended limits for a high-frequency trading system. The trading bot remains private; this repository publishes only audits and analysis.

## Key Results
- Total trades analyzed: 14,221 (WON/LOST)
- Win rate: 90.27%
- Profit total (raw history): -666.14
- Max loss streak observed: 4
- Loss probability estimate: 9.73%
- P(4 losses in a row): 0.01%
- P(at least one 4-loss run in 14,221 trades): 72.07%

## Ruin Risk (Martingale, 4 steps, payout 9%, x12)
- Steps 3 and 4 are net negative under current payout and multiplier.
- A 4-step martingale carries structural loss risk even with high win rate.

## Recommended Operating Limits
- Stake: 0.05% of balance (0.0005)
- Daily target: 5% of balance
- Rolling 24h validator: block trading if target reached
- Enforce daily cap (2% or 5%) to prevent overtrading

## Daily Cap Simulation (2%)
Based on real trade sequence:
- Baseline final balance: 9,338.75 (P&L -661.25)
- With 2% cap: 10,537.40 (P&L +537.40)
- Trades executed: 8,615
- Trades skipped: 5,609
- Skipped P&L: -1,198.65

## Conclusion
The system can be useful when operated with conservative stake sizing, strict daily targets, and short sessions. This materially reduces drawdown and improves the probability of stable results.

## Disclosure
Trading carries risk of loss. Past results do not guarantee future performance. This document is informational and not financial advice.
