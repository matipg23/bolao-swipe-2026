# World Cup 2026 Predictor App

A complete web application for managing user participation in a FIFA World Cup 2026 score prediction competition.

## Features

- ✅ User registration and authentication with email/password
- ✅ Email verification system
- ✅ Password reset functionality
- ✅ Score prediction submission for group stage matches (72 matches)
- ✅ Deadline enforcement (June 6, 2026) - editing disabled after deadline
- ✅ Visibility rules - view all predictions after deadline
- ✅ Real-time dashboard statistics
- ✅ Automatic qualification calculation (points, goal difference, goals scored)
- ✅ Knockout match generation (Round of 16, Quarterfinals, Semifinals, Final)
- ✅ Group standings display
- ✅ Countdown timer to deadline

## Technology Stack

- **Framework**: Next.js 14+ (App Router) with TypeScript
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT with HTTP-only cookies
- **Styling**: Tailwind CSS
- **Email**: Nodemailer (configurable for production services)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Email service configuration (for production)

### Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and configure:
- `DATABASE_URL` - SQLite database path (default: `file:./dev.db`)
- `JWT_SECRET` - Random secret key for JWT tokens
- Email settings (SMTP or use Resend/SendGrid for production)

4. Initialize the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Database Management

- View database: `npm run db:studio`
- Reset database: Delete `prisma/dev.db` and run `npm run db:push` and `npm run db:seed`

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── predictions/      # Prediction pages
│   ├── register/         # Registration page
│   ├── login/            # Login page
│   └── ...
├── components/           # React components
├── lib/                  # Utility functions
├── prisma/               # Database schema and seed
└── middleware.ts         # Authentication middleware
```

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `GET /api/verify-email` - Verify email with token
- `POST /api/forgot-password` - Request password reset
- `POST /api/reset-password` - Reset password with token

### Predictions
- `GET /api/predictions` - Get predictions (own or all after deadline)
- `POST /api/predictions` - Create/update prediction
- `PUT /api/predictions` - Update prediction
- `GET /api/predictions/[matchId]` - Get prediction for specific match

### Matches
- `GET /api/matches` - List matches (filterable by stage/group)
- `POST /api/matches` - Create match (admin)

### Dashboard
- `GET /api/dashboard/stats` - Get statistics (total users, completed predictions)

### Qualification
- `GET /api/qualification` - Get group standings and qualified teams
- `POST /api/qualification` - Calculate qualifications

### Knockout
- `POST /api/knockout/generate` - Generate knockout matches
- `PUT /api/knockout/generate` - Generate next round

### Settings
- `GET /api/settings` - Get app settings (deadline, etc.)

## Important Notes

1. **Round of 16 Format**: The plan specifies "top 2 teams from each group qualify for Round of 16", but 12 groups × 2 = 24 teams. The implementation calculates top 2 per group (24 teams total) and creates matches accordingly.

2. **Email Configuration**: For development, you can use Gmail SMTP or a service like Mailtrap. For production, consider Resend (3,000 emails/month free) or SendGrid (100 emails/day free).

3. **Deadline**: The hard deadline is June 6, 2026, 00:00:00 UTC. All editing is disabled after this date.

4. **Visibility**: Before the deadline, users can only see their own predictions. After the deadline, all predictions become visible to everyone.

## Development

- Run development server: `npm run dev`
- Build for production: `npm run build`
- Start production server: `npm start`
- Lint code: `npm run lint`

## License

This project is for educational/demonstration purposes.
