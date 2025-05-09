# Wedding Planner Web Application

A full-stack MERN (MongoDB, Express, React, Node.js) application for wedding planning services.

## Features

### Client Features:
- Browse wedding services and packages
- View portfolio of previous events
- Book wedding planning services
- User authentication and profile management
- Manage bookings
- Communication with planners

### Admin Features:
- Dashboard to manage bookings and clients
- Service management (add/edit/delete)
- Portfolio management
- Content management for website

## Tech Stack

### Frontend:
- React.js
- Redux for state management
- React Router for navigation
- Axios for API requests
- Bootstrap/Material UI for styling

### Backend:
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Multer for file uploads

## Getting Started

### Prerequisites:
- Node.js and npm
- MongoDB (local or Atlas)

### Installation:

1. Clone the repository:
```
git clone <repository-url>
cd wedding-planner
```

2. Install server dependencies:
```
cd server
npm install
```

3. Install client dependencies:
```
cd ../client
npm install
```

4. Create a `.env` file in the server directory with:
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

5. Run the development server:
```
cd ../server
npm run dev
```
This will start both the server (port 5000) and client (port 3000).

## Project Structure

```
wedding-planner/
├── client/             # React frontend
│   ├── public/         # Static files
│   └── src/            # React source files
│       ├── components/ # React components
│       ├── pages/      # Page components
│       ├── redux/      # Redux state management
│       └── utils/      # Utility functions
└── server/             # Node.js backend
    ├── controllers/    # Route controllers
    ├── middleware/     # Express middleware
    ├── models/         # Mongoose models
    ├── routes/         # Express routes
    └── index.js        # Server entry point
```

## License

MIT 