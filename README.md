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
- MongoDB (optional for development)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open http://localhost:3000

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
