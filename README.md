# ExpenseAI – Smart Expense Tracker with AI Insights

A modern full-stack web application designed to help users track, manage, and analyze daily expenses with AI-powered financial insights.

## 📋 Project Overview

ExpenseAI is built with:
- **Frontend:** React.js with modern UI/UX
- **Backend:** Node.js with Express.js
- **Database:** MongoDB
- **Charts:** Chart.js for beautiful data visualization
- **Authentication:** JWT + Bcrypt for secure access

## 🎯 Key Features

### ✅ User Authentication
- Secure signup and login with JWT
- Password encryption using Bcrypt
- Session management

### 💰 Expense Management
- Add, edit, and delete expenses
- Categorize spending (Food, Travel, Bills, Shopping, Health, Entertainment, Others)
- Add notes and date tracking

### 📊 Dashboard Analytics
- Monthly spending summary
- Category-wise spending breakdown
- Pie charts and bar graphs
- Real-time expense tracking

### 🤖 AI Insights
- Identify highest spending category
- Overspending alerts based on budget
- Predict next month's expenses
- Personalized saving suggestions

## 📁 Project Structure

```
ExpenseAI/
├── client/                 # React Frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/     # React Components
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── ExpenseForm.js
│   │   │   ├── ExpenseList.js
│   │   │   ├── Analytics.js
│   │   │   └── ProtectedRoute.js
│   │   ├── context/        # React Context
│   │   │   ├── AuthContext.js
│   │   │   └── ExpenseContext.js
│   │   ├── utils/
│   │   │   └── api.js      # Axios API client
│   │   ├── styles/         # CSS Files
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   └── .env.example
│
├── server/                 # Node.js Backend
│   ├── config/
│   │   └── db.js          # MongoDB connection
│   ├── controllers/        # Business Logic
│   │   ├── authController.js
│   │   └── expenseController.js
│   ├── middleware/         # Express Middleware
│   │   ├── auth.js        # JWT authentication
│   │   └── errorHandler.js
│   ├── models/            # MongoDB Models
│   │   ├── User.js
│   │   └── Expense.js
│   ├── routes/            # API Routes
│   │   ├── authRoutes.js
│   │   └── expenseRoutes.js
│   ├── utils/
│   │   └── generateToken.js
│   ├── server.js          # Main server file
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── README.md              # This file
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/expenseai
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
BCRYPT_ROUNDS=10
NODE_ENV=development
```

Start the backend server:
```bash
npm start
# or for development with auto-reload
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

```bash
cd client
npm install
```

Create a `.env` file in the `client` directory:
```
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:
```bash
npm start
```

The application will open at `http://localhost:3000`

## 🔌 API Endpoints

### Authentication Routes
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (Protected)
- `PUT /api/auth/budget` - Update budget (Protected)

### Expense Routes (All Protected)
- `GET /api/expenses` - Get all expenses
- `POST /api/expenses` - Create new expense
- `PUT /api/expenses/:id` - Update expense
- `DELETE /api/expenses/:id` - Delete expense
- `GET /api/expenses/analytics/summary` - Get analytics data

## 🧠 AI Logic Implementation

### Highest Spending Category
```
Calculates total amount spent in each category and identifies the highest
```

### Monthly Expense Prediction
```
Predicted Monthly = Average Daily Expense × 30
Helps users forecast their monthly spending
```

### Overspending Alert
```
If Monthly Expense > Budget → Alert user
Shows how much they've exceeded the budget
```

### Savings Suggestions
```
- If overspending: "You've exceeded budget by Rs. X"
- If within budget: "Great! You've spent Rs. X out of Rs. Y"
- Personalized recommendations based on spending patterns
```

## 💾 Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (hashed),
  budget: Number (default: 0),
  createdAt: Date,
  updatedAt: Date
}
```

### Expense Model
```javascript
{
  userId: ObjectId (ref: User),
  description: String (required),
  amount: Number (required, min: 0),
  category: String (enum: [categories]),
  date: Date (required),
  notes: String (optional),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔐 Security Features

- **Password Hashing:** Bcryptjs with 10 salt rounds
- **JWT Authentication:** Time-limited tokens (7 days)
- **Input Validation:** Server-side validation on all endpoints
- **CORS:** Properly configured for frontend-backend communication
- **Protected Routes:** Middleware to protect sensitive endpoints

## 🎨 UI/UX Highlights

- **Modern Design:** Clean and intuitive interface
- **Responsive Layout:** Works on desktop and mobile devices
- **Interactive Charts:** Real-time visualization of spending data
- **Dark-Friendly Colors:** Easy on the eyes with gradient backgrounds
- **Smooth Transitions:** Animated components for better UX

## 📈 Future Enhancements

- Voice input for expense tracking
- OCR bill scanner
- Mobile app (React Native)
- Bank account synchronization
- Multi-language support
- Export reports (PDF/CSV)
- Budget reminders and notifications
- Recurring expense templates
- Social sharing features

## 👥 Team Information

- **Team Name:** ExpenseAI
- **Members:** Priyanshu Thakur (24BCC70018), Sashi Yadav (24BIT70010)
- **Project Year:** 2nd Year

## 📝 Resume Description

Developed a full-stack AI-powered Smart Expense Tracker using React.js, Node.js, Express.js, and MongoDB with interactive dashboards, predictive analytics, and personalized budget insights. Implemented JWT-based authentication, responsive UI design, and real-time expense categorization with AI-driven savings recommendations.

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| Frontend | React.js, React Router, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, Bcryptjs |
| Visualization | Chart.js, react-chartjs-2 |
| Styling | CSS3 |

## 📄 License

This project is provided for educational purposes.

## 🤝 Support

For issues or questions, please contact the development team.

---

**ExpenseAI** - Smart Finance Decisions Made Easy! 💡
