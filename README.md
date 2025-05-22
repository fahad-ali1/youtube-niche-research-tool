# YouTube Competitor Dashboard

A modern web application that displays YouTube videos from competitors, built with a neobrutalism design style. The dashboard allows for filtering, sorting, and identification of outlier videos based on performance metrics.

## Features

- **Video Dashboard**: View competitors' YouTube videos in a card layout with complete metadata
- **Infinite Scroll Pagination**: Efficiently load videos as you scroll
- **Advanced Filtering**: Filter videos by:
  - Channel ID
  - View count
  - Like count
  - Comment count
  - Publish date
- **Outlier Analysis**: Identify high-performing videos that exceed channel averages by a configurable multiplier
- **Time Period Selection**: Filter data by different time spans (1 week, 2 weeks, 1 month, 2 months)
- **Responsive Design**: Works well on devices of all sizes
- **Performance Optimized**: Uses Redis for caching to minimize database queries

## Tech Stack

- **Next.js**: React framework for building the application
- **Tailwind CSS**: For styling with a neobrutalism design approach
- **Prisma**: ORM for database interactions
- **PostgreSQL**: Database for storing video statistics and competitor data
- **Redis**: For efficient caching of API responses
- **React Intersection Observer**: For implementing infinite scroll

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Redis server

### Environment Setup

Create a `.env` file in the root directory with the following variables:

```
DATABASE_URL=postgresql://username:password@localhost:5432/your_database
REDIS_URL=redis://localhost:6379
```

### Installation

1. Clone the repository
2. Install dependencies:

```bash
yarn install
```

3. Set up the database:

```bash
npx prisma db push
```

4. Run the development server:

```bash
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- **GET /api/videos**: Get videos with filtering, sorting, and pagination

  - Query parameters:
    - `channelId`: Filter by channel ID
    - `sortBy`: Sort by field (view_count, like_count, comment_count, publish_time)
    - `sortOrder`: Sort order (asc, desc)
    - `page`: Page number (0-based)
    - `pageSize`: Number of items per page
    - `timeFrame`: Time period filter (1w, 2w, 1m, 2m)
    - `outlierMultiplier`: Threshold for outlier detection (default: 2)

- **GET /api/competitors**: Get all competitors

## License

MIT

# YouTube Trends Finder Dashboard

## Environment Variables Setup

This application requires several environment variables to be set up in a `.env` file at the root of your project. Create this file and add the following variables:

```
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/youtube_trends"

# YouTube API Keys (multiple keys for quota rotation)
YOUTUBE_API_KEY_1="your-youtube-api-key-1"
YOUTUBE_API_KEY_2="your-youtube-api-key-2"
YOUTUBE_API_KEY_3="your-youtube-api-key-3"

# YouTube OAuth (if using authorized endpoints)
YOUTUBE_CLIENT_ID="your-youtube-client-id"
YOUTUBE_CLIENT_SECRET="your-youtube-client-secret"
YOUTUBE_REDIRECT_URI="http://localhost:3000/api/auth/callback/youtube"
```

### API Key Rotation System

The application automatically rotates between the three YouTube API keys when quota limits are reached. This maximizes the number of requests you can make to the YouTube API daily. You don't need to provide all three keys, but providing multiple keys is recommended.

### Obtaining YouTube API Keys

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the YouTube Data API v3
4. Create API keys from the Credentials page
5. Copy the API keys to your `.env` file

### Database Setup

Make sure to update the `DATABASE_URL` with your PostgreSQL connection details. The format is:

```
postgresql://username:password@host:port/database_name
```

After setting up your environment variables, restart your development server for the changes to take effect.
