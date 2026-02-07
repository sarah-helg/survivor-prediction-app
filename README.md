# Survivor Season 50 Prediction App

A Next.js web application for friends to predict Survivor contestant placements and compete on a leaderboard based on accuracy!

## Features

- 🏝️ **Contestant Rankings** - Rank all 24 Survivor Season 50 contestants from Winner (#1) to First Eliminated (#24)
- 🏆 **Scoring System** - Earn points based on prediction accuracy:
  - Exact match: 5 points
  - One off: 3 points
  - Two off: 1 point
  - Final 3 bonus: +5 points
- 📊 **Live Leaderboard** - Track scores as contestants are eliminated
- 👁️ **View Predictions** - See how other players ranked the contestants
- 🔥 **Admin Panel** - Manage eliminations and update contestant photos

## Tech Stack

- **Framework:** Next.js 16 with React 19
- **Database:** Neon (Serverless PostgreSQL)
- **Storage:** Vercel Blob (contestant photos)
- **Styling:** Tailwind CSS v4
- **UI Components:** Radix UI + Framer Motion
- **Language:** TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Neon database account (free tier works)
- A Vercel account for deployment

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd survivor-prediction-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env.local` file with:
```bash
DATABASE_URL=your_neon_database_url
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token
```

4. Set up the database:

Run the setup scripts in your Neon SQL editor:
```bash
# First run: scripts/setup-database.sql
# Then run: scripts/update-contestants-and-schema.sql
# Finally run: node scripts/update-db-simple.js
```

5. Upload contestant photos:
- Start the dev server: `npm run dev`
- Go to http://localhost:3000/admin
- Upload photos for each contestant

6. Start the development server:
```bash
npm run dev
```

Visit http://localhost:3000 to see the app!

## How to Play

1. **Submit Predictions** - Go to "Rankings" and drag contestants to rank them from #1 (Winner) to #24 (First Out)
2. **Lock In** - Once submitted, predictions are locked and cannot be changed
3. **Track Progress** - Check the "Leaderboard" after each elimination to see updated scores
4. **View Others** - See how other players ranked contestants in "View Predictions"

## Ranking System

- **Position #1** = Winner (Sole Survivor) 🏆
- **Position #2** = Runner-up 🥈
- **Position #3** = 3rd Place 🥉
- **Positions 1-3** = Final 3 (eligible for bonus points)
- **Position #24** = First person eliminated

## Admin Features

- Eliminate contestants and set their final rank
- Upload contestant photos
- View elimination history
- Automatic score calculation for all players

## Testing Scripts

Useful scripts for testing the scoring system:

```bash
# Create test user with predictions
node scripts/test-scoring.js

# Check scores and accuracy
node scripts/check-scores.js

# Undo last elimination
node scripts/undo-elimination.js

# Clean up all test data
node scripts/cleanup-test.js
```

## Deployment

This app is designed to be deployed on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables (DATABASE_URL, BLOB_READ_WRITE_TOKEN)
4. Deploy!

## Environment Variables

Required environment variables:

- `DATABASE_URL` - Neon PostgreSQL connection string
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage token

## Contributing

This is a personal project for friends, but feel free to fork and customize for your own Survivor pool!

## License

MIT

---

Built with ❤️ for Survivor Season 50 - In the Hands of the Fans
