# Crypto Discord - Cryptocurrency Tracker

A modern cryptocurrency tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Discover the latest cryptocurrency listings with real-time data from CoinMarketCap.

## Features

- 🔍 **New Listings Discovery**: Find the latest cryptocurrencies added to CoinMarketCap
- 📊 **Real-time Data**: Get live cryptocurrency prices and market data
- 💬 **Social Media Integration**: Direct links to Telegram and Discord communities
- 🎨 **Modern UI**: Clean, responsive design with dark/light mode support
- ⚡ **Fast Performance**: Optimized with Next.js 14 and App Router

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **API**: CoinMarketCap Pro API
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- CoinMarketCap API key

### Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd crypto-discord-nextjs
```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables:

```bash
# Create .env.local file
cp .env.example .env.local

# Add your CoinMarketCap API key
CMC_API_KEY=your_coinmarketcap_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment

### Vercel Deployment

1. **Connect to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Environment Variables:**

   - Go to Project Settings → Environment Variables
   - Add `CMC_API_KEY` with your CoinMarketCap API key

3. **Deploy:**
   - Vercel will automatically deploy on every push to main branch

### Environment Variables

| Variable          | Description                | Required        |
| ----------------- | -------------------------- | --------------- |
| `CMC_API_KEY`     | CoinMarketCap API key      | Yes             |
| `DATABASE_URL`    | Database connection string | No (future use) |
| `NEXTAUTH_URL`    | Production URL             | No (future use) |
| `NEXTAUTH_SECRET` | NextAuth secret            | No (future use) |

## API Integration

The application uses the CoinMarketCap Pro API to fetch:

- Latest cryptocurrency listings
- Real-time price data
- Social media links (Telegram, Discord)
- Market statistics

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── page.tsx          # Home page
│   └── layout.tsx        # Root layout
├── components/           # React components
│   ├── ui/              # UI components
│   └── new-listings.tsx # Main listings component
├── lib/                 # Utility functions
├── types/               # TypeScript definitions
└── utils/                 # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For support, please open an issue on GitHub or contact the development team.
