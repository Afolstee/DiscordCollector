# Crypto Discord - Cryptocurrency Tracker

A full-stack cryptocurrency tracking application built with Next.js 14, TypeScript, and Tailwind CSS. Track your favorite cryptocurrencies with real-time data, portfolio management, and market analysis.

## Features

- 🚀 **Real-time Data**: Live cryptocurrency prices and market data from CoinMarketCap API
- 📊 **Portfolio Tracking**: Track your investments and portfolio performance
- 📈 **Market Analysis**: Analyze market trends with interactive charts
- 🔔 **Watchlists**: Create and manage custom watchlists
- 📱 **Responsive Design**: Optimized for desktop and mobile devices
- 🎨 **Modern UI**: Beautiful interface with dark/light mode support
- ⚡ **Fast Performance**: Server-side rendering and optimized API calls

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **API**: CoinMarketCap Pro API
- **Authentication**: NextAuth.js
- **Charts**: Recharts
- **Icons**: Lucide React
- **UI Components**: Radix UI

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- CoinMarketCap Pro API key

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd crypto-discord-nextjs
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Fill in your environment variables:

   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/crypto_tracker"
   CMC_API_KEY="your-coinmarketcap-api-key"
   NEXTAUTH_SECRET="your-secret-key"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**

   ```bash
   npx prisma db push
   npx prisma generate
   ```

5. **Run the development server**

   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
crypto-discord-nextjs/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── crypto/        # Cryptocurrency endpoints
│   │   └── global-metrics/ # Global market data
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/                # Reusable UI components
│   ├── crypto-list.tsx    # Cryptocurrency list component
│   └── global-metrics.tsx # Global metrics component
├── lib/                   # Utility libraries
│   ├── api.ts            # API client
│   └── db.ts             # Database connection
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── middleware.ts         # Next.js middleware
└── package.json          # Dependencies and scripts
```

## API Endpoints

### Cryptocurrency Data

- `GET /api/crypto` - Get latest cryptocurrency listings
- `GET /api/crypto?symbol=BTC` - Get specific cryptocurrency data
- `POST /api/crypto` - Store cryptocurrency data

### Global Metrics

- `GET /api/global-metrics` - Get global market metrics

## Database Schema

The application uses PostgreSQL with Prisma ORM. Key models include:

- **User**: User accounts and authentication
- **Watchlist**: User-created watchlists
- **Portfolio**: User investment portfolios
- **CoinData**: Cryptocurrency metadata cache

## Features in Detail

### Real-time Data

- Live cryptocurrency prices from CoinMarketCap
- Market cap, volume, and price change data
- Global market metrics and trends

### Portfolio Management

- Track your cryptocurrency investments
- Calculate portfolio performance
- View gains/losses and percentages
- Historical performance charts

### Watchlists

- Create custom cryptocurrency watchlists
- Monitor specific coins and tokens
- Get alerts for price changes

### Market Analysis

- Interactive price charts
- Market trend analysis
- Volume and liquidity metrics
- Historical data visualization

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push database schema
npm run db:studio    # Open Prisma Studio
npm run db:generate  # Generate Prisma client
```

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Prettier for code formatting
- Tailwind CSS for styling

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:

- Create an issue on GitHub
- Check the documentation
- Join our Discord community

## Acknowledgments

- CoinMarketCap for providing the API
- Next.js team for the amazing framework
- Vercel for deployment platform
- All contributors and users
