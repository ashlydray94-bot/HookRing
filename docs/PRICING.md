# HookRing Pricing & Monetization Model

## Overview

HookRing operates on a **freemium + optional one-off purchase model** designed to balance user acquisition with revenue generation.

---

## Pricing Tiers

### 1. Free Tier (No Payment Required)
**Target:** Casual users, new users testing the app

| Parameter | Value |
|-----------|-------|
| Monthly Export Limit | 3 ringtones |
| Max Clip Length | 15 seconds |
| Bitrate | 128 kbps (standard) |
| Supported Formats | MP3 only |
| Cloud Backup | None |
| Ad Support | Yes (optional, can be removed with subscription) |

**User Value Proposition:**
- Risk-free trial of core functionality
- Create 3 quality ringtones per month
- Perfect for occasional users

**Revenue:** None directly, but drives user acquisition and potential upgrades

---

### 2. One-Off Purchase ($0.99)
**Target:** Users who exceed free tier or want flexibility without subscription commitment

| Parameter | Value |
|-----------|-------|
| Purchase Type | Pay-per-export |
| Export Limit | 1 additional ringtone |
| Max Clip Length | 15 seconds |
| Bitrate | 128 kbps (standard) |
| Supported Formats | MP3 only |
| Validity | Single use, non-refundable |
| Frequency | Can be purchased multiple times |

**Use Cases:**
- "I liked the app and want one more ringtone this month"
- Budget-conscious users who don't want monthly commitment
- A/B testing premium features without full subscription

**Revenue:** Directly per purchase, low friction entry point

---

### 3. Premium Subscription
**Target:** Power users, frequent creators, users who want best quality

#### Monthly Plan
- **Price:** $2.99/month
- **Billing Cycle:** Monthly
- **Auto-Renewal:** Yes, can be cancelled anytime

#### Annual Plan (Best Value)
- **Price:** $19.99/year (~$1.67/month)
- **Savings:** 33% discount vs. monthly
- **Billing Cycle:** Annual
- **Auto-Renewal:** Yes, can be cancelled anytime

| Parameter | Value |
|-----------|-------|
| Monthly Export Limit | Unlimited |
| Max Clip Length | 30 seconds |
| Bitrate Options | 128, 192, 256, 320 kbps |
| Supported Formats | MP3, WAV, M4R (iOS), OGG, FLAC |
| Cloud Backup | 30 days (auto-delete) |
| Ad Support | Ad-free experience |
| Priority Support | Email + chat support (24-48 hrs) |
| Batch Export | Export multiple ringtones at once |
| Custom Metadata | Add artist/title metadata to files |

**User Value Proposition:**
- Unlimited creative freedom
- Professional-grade audio quality
- Time-saving features (batch export)
- Premium support
- Works out to **$0.17 per ringtone per year** on annual plan

**Revenue:** Recurring monthly or annual revenue, highest lifetime value

---

## Feature Comparison Table

| Feature | Free | One-Off | Premium |
|---------|------|---------|---------|
| **Exports/Month** | 3 | 1 | ∞ |
| **Max Duration** | 15s | 15s | 30s |
| **Bitrate** | 128k | 128k | Up to 320k |
| **Formats** | MP3 | MP3 | MP3/WAV/M4R/OGG/FLAC |
| **Cloud Backup** | ✗ | ✗ | 30 days |
| **Batch Export** | ✗ | ✗ | ✅ |
| **Ad-Free** | ✗ | ✗ | ✅ |
| **Priority Support** | ✗ | ✗ | ✅ |
| **Custom Metadata** | ✗ | ✗ | ✅ |
| **Price** | Free | $0.99 | $2.99/mo or $19.99/yr |

---

## Revenue Projections

### Conservative Scenario (Year 1)
- 10,000 users
- 10% free-to-premium conversion = 1,000 subscribers
- 20% annual plan (higher LTV) = 800 @ $19.99/yr, 200 @ $2.99/mo
- One-off purchases: 500 @ $0.99

**Year 1 Revenue:**
- Annual subscriptions: $15,992
- Monthly subscriptions: $7,176
- One-off purchases: $495
- **Total: ~$23,663**

### Realistic Scenario (Year 1)
- 50,000 users
- 5% free-to-premium conversion = 2,500 subscribers
- 60% annual plan = 1,500 @ $19.99/yr, 1,000 @ $2.99/mo
- One-off purchases: 2,000 @ $0.99

**Year 1 Revenue:**
- Annual subscriptions: $29,985
- Monthly subscriptions: $35,880
- One-off purchases: $1,980
- **Total: ~$67,845**

### Optimistic Scenario (Year 1)
- 100,000 users
- 8% free-to-premium conversion = 8,000 subscribers
- 70% annual plan = 5,600 @ $19.99/yr, 2,400 @ $2.99/mo
- One-off purchases: 5,000 @ $0.99

**Year 1 Revenue:**
- Annual subscriptions: $111,944
- Monthly subscriptions: $86,400
- One-off purchases: $4,950
- **Total: ~$203,294**

---

## Monetization Strategy

### User Acquisition Funnel
1. **Free Tier** → Low-friction entry (3 exports/month)
2. **One-Off Purchase** → Micro-commitment option ($0.99)
3. **Premium Subscription** → Full commitment with max value

### Retention & Upsell
- **In-app prompts** when users approach export limits
- **Limited-time offers** (e.g., "First month 50% off")
- **Social sharing incentives** (bonus export for sharing)
- **Seasonal campaigns** (e.g., custom ringtones for holidays)

### Payment Processing
- **Primary:** Stripe (for web/Android)
- **iOS:** Apple App Store (in-app purchases, 30% fee)
- **Alternative:** RevenueCat (abstraction layer for mobile subscriptions)

---

## Financial Model Assumptions

| Assumption | Value |
|-----------|-------|
| App Store/Play Store Fee | 30% (iOS), 15-30% (Android) |
| Payment Processor Fee (Stripe) | 2.9% + $0.30 per transaction |
| Customer Acquisition Cost (CAC) | $0.50–$2.00 |
| Lifetime Value (LTV) - Free | $0 (ad revenue only) |
| Lifetime Value (LTV) - One-Off | $0.69 (after fees) |
| Lifetime Value (LTV) - Premium Annual | $10–$12 |
| LTV:CAC Ratio Target | 3:1 or better |

---

## Future Monetization Opportunities

1. **Ads in Free Tier** — Non-intrusive banner ads or rewarded video ads
2. **Premium Features:**
   - AI-powered beat detection for auto-trimming
   - Ringtone templates & presets
   - Equalizer & audio effects
3. **B2B Licensing** — White-label solution for carriers/OEMs
4. **Marketplace** — Community-created ringtone packs ($0.99–$2.99)
5. **Enterprise API** — For music platforms wanting ringtone export

---

## Compliance & Legal

- **App Store Compliance:** All pricing adheres to Apple App Store Review Guidelines
- **GDPR/Privacy:** Clear data handling for subscription data
- **Refund Policy:** 30-day money-back guarantee for annual subscriptions
- **Terms of Service:** Must include Spotify API terms and restrictions

---

## Success Metrics

| Metric | Target (Year 1) |
|--------|-----------------|
| Free Users | 50,000+ |
| Premium Conversion Rate | 5–8% |
| One-Off Purchase Rate | 2–4% |
| Monthly Churn Rate | <5% |
| LTV:CAC Ratio | >3:1 |
| Annual Revenue | $50,000–$200,000 |

---

## Questions & Support

For questions about pricing or feature availability, see [CONTRIBUTING.md](../CONTRIBUTING.md).
