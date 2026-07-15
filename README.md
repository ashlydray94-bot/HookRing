# HookRing 🎵

Turn any Spotify track into a high-quality ringtone in seconds. Browse Spotify's catalogue, pick your favourite song, trim the perfect 15–30 second clip, and export it as a custom ringtone — all from one app. No audio engineering needed. Delivers studio-quality output optimised for iOS and Android.

---

## Features

- 🎧 **Spotify Integration** — Browse and search Spotify's entire music catalogue
- ✂️ **Precision Trimming** — Select the perfect 15–30 second clip
- 🎚️ **Audio Quality Control** — Adjust bitrate and format for optimal ringtone playback
- 📱 **Multi-Platform Export** — Optimized for iOS and Android
- 🎯 **One-Click Export** — Generate studio-quality ringtones in seconds

---

## Pricing & Monetization

HookRing uses a **freemium model** with three tiers:

### 🆓 Free Tier
- **3 free ringtone exports per month**
- Up to 15-second clips
- Standard bitrate (128 kbps)
- Basic audio formats (MP3)
- **No credit card required**

### 💎 Premium Subscription
- **Unlimited ringtone exports**
- Up to 30-second clips
- Higher bitrate (320 kbps)
- Advanced audio formats (WAV, M4R, OGG)
- Priority support
- **Pricing:**
  - $2.99/month (billed monthly)
  - $19.99/year (20% savings, ~$1.67/month)

### 💰 One-Off Purchase
- **$0.99 per additional ringtone** (for users who don't want to subscribe)
- Single export only
- Standard bitrate (128 kbps)
- Ideal for occasional users or trial conversions

---

## Feature Tier Matrix

| Feature | Free | One-Off | Premium |
|---------|------|---------|---------|
| Monthly Exports | 3 | 1 | Unlimited |
| Max Clip Length | 15 sec | 15 sec | 30 sec |
| Bitrate Options | 128 kbps | 128 kbps | 128, 192, 256, 320 kbps |
| Audio Formats | MP3 | MP3 | MP3, WAV, M4R, OGG |
| Spotify Browsing | ✅ | ✅ | ✅ |
| Custom Naming | ✅ | ✅ | ✅ |
| Cloud Storage | ✗ | ✗ | ✅ (30 days) |
| Priority Support | ✗ | ✗ | ✅ |

---

## Getting Started

### Prerequisites
- Node.js 16+ (backend)
- React Native / Flutter (mobile)
- Spotify API credentials
- Payment processor API keys (Stripe/RevenueCat)

### Installation

```bash
# Clone the repository
git clone https://github.com/ashlydray94-bot/HookRing.git
cd HookRing

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
```

### Configuration

See [SETUP.md](./docs/SETUP.md) for detailed configuration instructions.

---

## Architecture

```
HookRing/
├── backend/              # Node.js/Express API
│   ├── routes/
│   ├── controllers/
│   ���── middleware/       # Auth, freemium logic
│   └── services/
├── mobile/               # React Native / Flutter
│   ├── screens/
│   ├── components/
│   └── services/
├── docs/                 # Documentation
└── tests/                # Test suites
```

---

## Development

### Running Locally

```bash
# Start backend
npm run dev:backend

# Start mobile app
npm run dev:mobile
```

### Testing

```bash
npm test
```

---

## Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## License

This project is licensed under the MIT License — see [LICENSE](./LICENSE) for details.

---

## Support

- 📧 Email: support@hookring.app
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](#)

---

**Made with ❤️ by the HookRing team**
