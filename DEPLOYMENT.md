# Vercel Deployment Guide

## Prerequisites

- Vercel account
- CoinMarketCap API key

## Environment Variables

Set the following environment variables in your Vercel dashboard:

### Required Variables

- `CMC_API_KEY`: Your CoinMarketCap API key

### Optional Variables (for future features)

- `DATABASE_URL`: Database connection string
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: Secret for NextAuth

## Deployment Steps

1. **Connect your repository to Vercel:**

   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure environment variables:**

   - Go to Project Settings → Environment Variables
   - Add `CMC_API_KEY` with your CoinMarketCap API key

3. **Deploy:**
   - Vercel will automatically deploy on every push to main branch
   - Or manually trigger deployment from the dashboard

## Local Development

1. Copy `.env.example` to `.env.local`
2. Add your API keys to `.env.local`
3. Run `npm run dev`

## API Key Setup

1. Get your CoinMarketCap API key from [coinmarketcap.com/api](https://coinmarketcap.com/api)
2. Add it to your Vercel environment variables
3. The app will automatically use the API key for fetching cryptocurrency data

## Features

- ✅ New cryptocurrency listings with social media links
- ✅ Real-time data from CoinMarketCap
- ✅ Responsive design
- ✅ Dark/light mode support
- ✅ Optimized images with Next.js Image component
