# MedaStaré Global Compliance & Market Activation Register
**Working version:** 1.0 | **Prepared:** 2026-10-28 | **Status:** Internal review; NOT legal clearance or proof of deployed compliance.

## Critical rule
Worldwide app availability ≠ permission to sell subscriptions in every jurisdiction ≠ authorization to operate a prize competition in every jurisdiction. Do not label a market "legally approved" without local counsel sign-off and payment, age, privacy, tax, promotion, and operational checks.

## Initial market decision matrix
"Operationally available" below is not verified; no country is cleared by this document. "Hold" refers to **new cash-prize StarDrop entries** pending a published edition schedule and legal review, not automatic app geo-blocking.

| Market | Fashion/AI app | Paid SaaS / in-app subscriptions | StarDrop cash-prize contest | Required local review |
|---|---|---|---|---|
| United States | Product and privacy review | App-store disclosures, renewals, state consumer law | HOLD | State-by-state contest/sweepstakes, registration/bonding where applicable, prize tax, no-purchase/consideration analysis |
| EU/EEA (Italy, Germany etc.) | GDPR + AI Act assessment | Consumer withdrawal, digital services, VAT, platform rules | HOLD | Each targeted country: prize promotion law, eligibility, taxes, permits; GDPR transfer mechanism |
| United Kingdom | UK GDPR, PECR, consumer law | Renewal, cancellation, VAT | HOLD | UK prize promotion / skill competition assessment and tax |
| UAE (Dubai) | UAE data and content law | VAT, payments, local consumer rules | HOLD | Emirate-specific promotional permits, prizes, organizer licensing |
| Singapore | PDPA + cross-border transfers | Subscription/consumer and tax checks | HOLD | Gambling Control Act contest classification, permit/exemption and promotion review |
| Brazil | LGPD, ANPD transfer rules | CDC consumer law, renewal, taxes | HOLD | Promotional prize authorization, eligibility, award and tax rules |
| Japan | APPI and cross-border disclosures | Subscription/consumer/tax | HOLD | Premiums and Representations Act / contest limits |
| South Korea | PIPA and AI rules | Recurring billing, e-commerce | HOLD | Prize promotion and consumer rules |
| Australia | Privacy Act and consumer law | Subscription and GST | HOLD | State/territory competition classification |
| Switzerland | FADP | Consumer and tax review | HOLD | Contest, prize and marketing law |
| Türkiye | KVKK + transfers | Distance sales and digital service obligations | HOLD | Prize contest/promotion and tax assessment |
| All other jurisdictions | NOT YET REVIEWED | NOT YET REVIEWED | HOLD | Country-by-country legal assessment |

## Mandatory cross-product controls and evidence
1. **Data map:** inventory each feature (MedAI, MedaVision, StarDay, StyleTrack, StaréMatch, wardrobe, MedArena) and each category of personal data, processor, country, retention, purpose and legal basis. Verify actual implementation against published privacy notice.
2. **AI vendor register:** record OpenAI, Gemini, Kling, Meshy, Higgsfield and any additional production vendors *only if actually integrated*; record DPA, subprocessor list, model-training setting, retention, international transfers, incident notice, deletion and subprocessors. No vendor is marked contractually verified.
3. **International transfers:** assess GDPR SCCs / UK IDTA or addendum / Brazil ANPD transfer mechanism / other local transfer requirements where relevant. Obtain counsel review.
4. **Cookie deployment audit:** inspect production requests with a clean browser before consent; non-essential analytics, advertising and replay scripts must be suppressed wherever prior consent is required. Check reject-all, granular opt-in, withdraw, consent logging and regional behavior. **NOT TECHNICALLY VERIFIED.**
5. **AI transparency:** clear AI interaction notices, synthetic media labeling where required, user correction/report paths, human oversight for prizes, image-rights controls, minors and sensitive-data safeguards.
6. **Subscription purchase audit:** app-store product metadata, actual prices, taxes, trial/auto-renewal disclosure, cancellation path, refund statutory rights and payment processor records by market. **NOT VERIFIED.**
7. **Competition control:** edition status default closed; published rules on one page before launch; immutable version archive; local country/state eligibility whitelist, age verification, entry deadlines, prize source and fulfillment budget, skill judging evidence, human appeals, tax and promotion permit review. No universal cash-prize activation.
8. **Privacy rights operations:** access, deletion, export, objection/opt-out, consent withdrawal, retention schedules, DSAR response workflows and incident notification escalation.
9. **Governance:** owner + due date + proof URL for every control, outside counsel sign-off before any market moves from HOLD to APPROVED.
10. **Publication:** deploy website policy versions; verify live page content and footer links; preserve old versions; record effective date and changes. GitHub commit alone is not proof of deployment.

## Priority backlog
P0 — Verify production domain and hosting; cookie requests and consent manager; subscription purchase/renewal UI; contest API gating; verify legal contact address; preserve previously advertised StarDrop 10k campaign evidence and commitments.
P1 — Execute vendor DPA and transfer review; publish dated legal document changelog; complete GDPR/UK/LGPD data rights and AI transparency mapping; obtain country-specific promotion opinions.
P2 — Translate consumer-facing notices and rights flows where required; set monitoring cadence for new jurisdictions and laws.

## Source starting points (not exhaustive)
- EU AI Act timeline: https://ai-act-service-desk.ec.europa.eu/en/ai-act/eu-ai-act-implementation-timeline
- European Commission AI Act enforcement: https://digital-strategy.ec.europa.eu/en/policies/enforcement-ai-act
- Brazil ANPD international transfers: https://www.gov.br/anpd/pt-br/assuntos/assuntos-internacionais/transferencia-internacional-de-dados

**Approval ledger:** no market approved; no vendor DPA confirmed; no technical cookie audit completed; no deployed policy version confirmed. This register is an implementation and legal review plan, not legal advice.
