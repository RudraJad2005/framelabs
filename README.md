# FrameLab

The Python Framework for AI Agent Testing.

## Tech Stack

- **Backend:** Node.js + Express.js
- **Database:** MongoDB + Mongoose
- **Templating:** EJS
- **Auth:** JWT + bcrypt
- **Frontend:** HTML5, CSS3, Vanilla JavaScript

## Project Structure

```
FrameLab/
├── src/                    # Backend source code
│   ├── app.js              # Express app entry point
│   ├── config/             # Configuration files
│   │   └── database.js     # MongoDB connection
│   ├── controllers/        # Route controllers
│   │   ├── authController.js
│   │   ├── apiController.js
│   │   └── pageController.js
│   ├── middleware/         # Custom middleware
│   │   └── auth.js         # JWT auth middleware
│   ├── models/             # Mongoose models
│   │   ├── User.js
│   │   ├── Contact.js
│   │   └── Subscriber.js
│   ├── routes/             # Express routes
│   │   ├── authRoutes.js
│   │   ├── apiRoutes.js
│   │   └── pageRoutes.js
│   └── utils/              # Utility functions
│       └── helpers.js
├── public/                 # Static files
│   ├── css/
│   │   ├── style.css       # Main styles
│   │   ├── components.css  # UI components
│   │   └── responsive.css  # Media queries
│   ├── js/
│   │   ├── main.js         # Main JavaScript
│   │   └── animations.js   # Animation utilities
│   └── assets/
│       ├── images/
│       └── icons/
├── views/                  # EJS templates
│   ├── pages/              # Page templates
│   └── partials/           # Reusable partials
├── package.json
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB or PostgreSQL (optional for development)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/framelab.git
   cd framelab
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables in `.env`:
   - Set `JWT_SECRET` to a secure random string
   - Set `SESSION_SECRET` to a secure random string
   - (Optional) Configure OAuth credentials for Google/GitHub login
   - (Optional) Configure database connection string

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:3000

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRE=7d
SESSION_SECRET=your-session-secret-change-this
COOKIE_EXPIRE=7

# Database (Optional)
MONGODB_URI=mongodb://localhost:27017/framelab
# OR
DATABASE_URL=postgresql://user:password@localhost:5432/framelab

# OAuth (Optional - for social login)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/api/auth/github/callback
```

**⚠️ IMPORTANT:** Never commit your `.env` file to version control!

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## API Endpoints

### Pages
- `GET /` - Homepage
- `GET /features` - Features page
- `GET /pricing` - Pricing page
- `GET /docs` - Documentation
- `GET /about` - About page
- `GET /contact` - Contact page
- `GET /login` - Login page
- `GET /signup` - Signup page

### Auth API
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user (protected)

### General API
- `POST /api/contact` - Submit contact form
- `POST /api/newsletter` - Subscribe to newsletter
- `POST /api/waitlist` - Join waitlist

## License

MIT

## Security

- All sensitive credentials are stored in `.env` file (excluded from git)
- JWT tokens are used for authentication
- Passwords are hashed using bcrypt
- Session secrets are required for secure sessions

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For support, email support@framelab.com or open an issue on GitHub.
