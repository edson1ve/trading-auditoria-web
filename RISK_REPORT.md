# Risk Report - Ruin Study and Operating Limits

Generated: 2026-02-20

## Purpose
This document presents the real risk of operating a high-frequency trading system using the provided historical results. It is written for investors and public audit transparency. The trading bot remains private; this repository only publishes audit data and analysis.

## Data Sources
- trading_results.csv (real trade outcomes)
- daily_sessions.csv (daily summary)

Total trades analyzed: 14,221 (WON/LOST only)

## Executive Summary
- Win rate: 90.27%
- Profit total (historical, raw): -666.14
- Max loss streak observed: 4
- Loss probability estimate: 9.73%
- P(4 losses in a row) per cycle: 0.01%
- P(at least one 4-loss run in 14,221 trades): 72.07%
- Empirical payout: 0.0695
- Input payout (model): 0.09

## Ruin Model (Martingale, 4 steps)
We estimate:
- $q = 1 - w$ where $w$ is win rate
- $P(4\ losses\ in\ a\ row) = q^4$
- $P(\text{at least one 4-loss run}) \approx 1 - (1 - q^4)^{n-3}$

With $w=0.9027$, $q=0.0973$, and $n=14,221$:
- $q^4 = 0.0000897$ (0.01%)
- $P(\text{at least one 4-loss run}) \approx 72.07%$

### Stake Capacity (Balance 10,000, x12, 4 steps)
- Current stake (last observed): 18.78
- Bankroll required for 4 steps at 18.78: 35,400.30
- Max stake (balance 10,000): 5.3050
- Max stake conservative (80%): 4.2440

### Net Profit per Step (stake = 4.2440)
- Step 1: +0.38
- Step 2: +0.34
- Step 3: -0.17
- Step 4: -6.28

Conclusion: With payout 9% and multiplier x12, steps 3-4 are net negative. A 4-step martingale has structural loss risk despite high win rate.

## Stake Scenarios (Real Data)
Stake levels are segmented by quantiles:
- Small: stake <= 0.35
- Medium: 0.42 to 3.88
- High: 3.89 to 5713.78

| Segment | Trades | Win rate | Avg stake | Stake min | Stake max | Profit sum |
|---|---:|---:|---:|---:|---:|---:|
| small | 8,224 | 90.28% | 0.35 | 0.35 | 0.35 | -131.15 |
| medium | 1,187 | 90.48% | 1.5577 | 0.42 | 3.88 | -37.87 |
| high | 4,810 | 90.19% | 63.0776 | 3.89 | 5713.78 | -497.12 |

## High-Frequency Operating Limits

### Daily Cap (2% of day-start balance)
Simulation using real trade order:
- Baseline final balance: 9,338.75 (P&L -661.25)
- With 2% daily cap: 10,537.40 (P&L +537.40)
- Trades executed: 8,615
- Trades skipped: 5,609
- Skipped P&L: -1,198.65
- Active days: 12
- Days hitting 2% target: 9

This rule reduces exposure after hitting target and improved outcomes in the sample.

### Recommended Operating Rule
- Stake: 0.05% of balance (0.0005)
- Daily target: 5% of balance
- 24h rolling validator blocks trading if target reached

Rationale:
- Small stake reduces exposure in high frequency sequences.
- Daily target locks profit and prevents overtrading.
- 24h window prevents immediate re-entry after a strong day.

## Best Strategy (Investor-Facing Guidance)
1. Operate only in short time windows with daily targets.
2. Use low stake (0.05%) to limit drawdown.
3. Enforce daily caps (2% or 5%) and stop trading once reached.
4. Do not exceed 4-step martingale with payout below 10%.
5. Prefer short sessions with frequent audit updates.

## Risk Disclosure
Trading carries risk of loss. Past performance does not guarantee future results. The analysis here is based on historical data and assumes similar market behavior. This is not investment advice.

## Public Audit Policy
- This repository only publishes audit data and analysis.
- Trading bot code and Telegram bot remain private.
- The service is offered via API under Deriv conditions.

## Files in This Repository
- /public/reports/martingale_risk.html
- /public/reports/martingale_risk.json
- /public/reports/risk_report.html
- /public/reports/daily_cap_summary.json
- RISK_REPORT.md
